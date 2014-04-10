var pg = require('pg.js');
var copyFrom = require('pg-copy-streams').from;
var S = require('string');
var util = require('util');
var stream = require('stream');
var moment = require('moment');
var csv = require("fast-csv");
var query = require("./queries.js");
var types = require("./types");
var options = require('../../options');

/* istanbul ignore next */
module.exports = function () {
  var Transform = stream.Transform || require('readable-stream').Transform;
/*
  function validate(column, data) {
    if (column.type === "date") {
      var date = moment(data);
      return date.isValid();
    } else if (column.type.string !== undefined) {
      return data.length <= column.type.string;
    } else {
      return true;
    }
  }
*/

  function format(table, data) {
    var result = {};
    var sources = {};
    for (var key in data) {
      sources[key] = data[key];
    }
    var valid = Object.keys(table.specs.sources).every(function (sourceName) {
      var valid = true;
      var value;
      var d = data[table.specs.sources[sourceName].source];
      var type = table.specs.sources[sourceName].type;
      var typef = types[type]();
      value = typef.format(d);
      if (typef.validate(value)) {
        sources[sourceName] = value;
        return true;
      } else {
        return false;
      }

    });
    if (!valid) {
      // TODO : report invalid source
      //console.log(sources);
      return valid;
    }
    valid = Object.keys(table.specs.columns).every(function (columnName) {
      var column = table.specs.columns[columnName];
      if (column.value) {
        result[columnName] = types[column.type](column).format(sources);
      } else if (column.format) {
        result[columnName] = S(column.format).template(sources).s;
      } else if (column.source) {
        result[columnName] = types(column.type).format(data[column.source]);
      }
      return types(column.type).validate(result[columnName]);
    });
    if (!valid) {
      // TODO : report invalid source
      //console.log(result);
      return;
    }
    return result;
  }
  var pgformatter = function (table, options) {
    // allow use without new
    if (!(this instanceof pgformatter)) {
      return new pgformatter(options);
    }
    options = options || {};
    this.__pkeys = {};
    // init Transform
    Transform.call(this, options);
    this.__table = table;
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
  };

  util.inherits(pgformatter, Transform);
  pgformatter.prototype._saveKey = function (data) {
    var key = [];
    for (var i = 0; i < this.__table.specs.primaryKey.length; i++) {
      key.push(data[this._keys.indexOf(this.__table.specs.primaryKey[i])]);
    }
    if (key.join() in this.__pkeys) {
      //console.log('pkey');
      //console.log(data);
      // TODO : report duplicate rows
      return false;
    }
    this.__pkeys[key.join()] = null;
    return true;
  };
  pgformatter.prototype.__table = undefined;
  pgformatter.prototype._transform = function (chunk, enc, cb) {
    var txt = chunk.toString();
    var buffer = chunk;
    chunk = format(this.__table, JSON.parse(chunk.toString()));

    if (!chunk) {
      this.push(new Buffer(0), enc);
      cb();
      return;
    }

    this._keys = this._keys || Object.keys(chunk);
    var data = [
      []
    ];
    for (var index = 0; index < this._keys.length; index++) {
      data[0][index] = chunk[this._keys[index]].toString() || '';
    }
    if (!this._saveKey(data[0])) {
      this.push(new Buffer(0), enc);
      cb();
      return;
    }
    this.push(new Buffer(csv.writeToString(data) + "\n"), enc);
    cb();
  };

  pgformatter.prototype._flush = function (cb) {
    this.push(new Buffer("\\.\n"));
    cb();
  };

  var postgres = function (configuration, reporter) {
    this.__configuration = configuration;
    this.__reporter = reporter;
  };

  var client = function (pgclient, reporter) {
    this.__pgclient = pgclient;
    this.__reporter = reporter;
  };

  var table = function (client, specs) {
    this.specs = specs;
    this.__client = client;
    this.__transformer = function () {
      return new pgformatter(this);
    };
  };

  table.prototype.dest = function () {
    var transform = this.__transformer();
    transform.pipe(this.__client.stream(this.specs));
    return transform;
  };

  client.prototype = {
    table: function (specs, callback) {
      specs = options(specs, {
        schema: "public",
        sources: {}
      });
      var client = this;
      var sql = query.schema.create(specs);
      client.__reporter.verbose(client.name(), "database", sql);
      this.__pgclient.query(sql, function (error) {

        var sql = query.table.create(specs);
        client.__reporter.verbose(client.name(), "database", sql);
        client.__pgclient.query(sql, function (error) {
          if (error) {
            error.query = sql;
          }
          callback(error, new table(client, specs));
        });
      });
    },
    stream: function (specs) {
      return this.__pgclient.query(copyFrom(query.table.stream(specs)));
    },
    name: function () {
      return this.__pgclient.database;
    }
  };

  postgres.prototype = {

    __configuration: undefined,
    name: function () {
      return this.__configuration.name;
    },
    connect: function (callback) {
      var that = this;
      pg.connect(this.__configuration, function (error, pgclient, done) {
        if (error) {
          error.query = query.database.create(that.__configuration);
          error.message = "Could not connect to database with user specified.\nCorrect configuration or use the following query to setup database and user:\n" + error.query;
        }
        callback(error, new client(pgclient, that.__reporter), done);
      });
    }
  };

  return postgres;
}();