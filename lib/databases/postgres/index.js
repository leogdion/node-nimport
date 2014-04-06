var pg = require('pg.js');
var copyFrom = require('pg-copy-streams').from;
var S = require('string');
var util = require('util');
var stream = require('stream');
var moment = require('moment');
var csv = require("fast-csv");
var query = require("./queries.js");
var types = require("./types");

/* istanbul ignore next */
module.exports = function () {
  var Transform = stream.Transform || require('readable-stream').Transform;

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
      return valid;
    }
    valid = Object.keys(table.specs.columns).every(function (columnName) {
      var column = table.specs.columns[columnName];
      if (column.format) {
        result[columnName] = S(column.format).template(sources).s;
      } else if (column.source) {
        result[columnName] = data[column.source].trim();
      }

      return validate(column, result[columnName]);
    });
    if (!valid) {
      console.log(result);
    }
    return valid ? result : undefined;
  }
  var pgformatter = function (table, options) {
    // allow use without new
    if (!(this instanceof pgformatter)) {
      return new pgformatter(options);
    }
    options = options || {};
    // init Transform
    Transform.call(this, options);
    this.__table = table;
    this._writableState.objectMode = true;
    this._readableState.objectMode = false;
  };

  util.inherits(pgformatter, Transform);

  pgformatter.prototype.__table = undefined;
  pgformatter.prototype._transform = function (chunk, enc, cb) {
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
      data[0][index] = chunk[this._keys[index]] || '';
    }
    this.push(new Buffer(csv.writeToString(data) + "\n"), enc);
    cb();
  };

  pgformatter.prototype._flush = function (cb) {
    this.push(new Buffer("\\.\n"));
    cb();
  };

  var postgres = function (configuration) {
    this.__configuration = configuration;

  };

  var client = function (pgclient, done) {
    this.__pgclient = pgclient;
  };

  var table = function (client, specs) {
    this.specs = specs;
    this.__client = client;
    this.__transformer = new pgformatter(this);
  };

  table.prototype.dest = function () {
    this.__transformer.pipe(this.__client.stream(this.specs));
    return this.__transformer;
  };

  client.prototype = {
    table: function (specs, callback) {
      var client = this;
      this.__pgclient.query(query.table.create(specs), function (error) {
        callback(error, new table(client, specs));
      });
    },
    stream: function (specs) {
      return this.__pgclient.query(copyFrom(query.table.stream(specs))); //"COPY " + specs.name + " FROM STDIN with CSV"));
    }
  };

  postgres.prototype = {

    __configuration: undefined,
    connect: function (callback) {
      var that = this;
      pg.connect(this.__configuration, function (error, pgclient, done) {
        if (error) {
          error.query = query.database.create(that.__configuration); //"CREATE ROLE " + that.__configuration.user + " LOGIN PASSWORD '" + that.__configuration.password + "' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION; CREATE DATABASE " + that.__configuration.database + " WITH OWNER " + that.__configuration.user + ";";
        }
        callback(error, new client(pgclient), done);
      });
    }
  };

  return postgres;
}();