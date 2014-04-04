var csv = require("fast-csv");
var util = require('util');
var stream = require('stream');
var fs = require('fs');
var S = require('string');
var moment = require('moment');

module.exports = function () {
  var source = function (configuration, table) {
    this.__configuration = configuration;
    this.__fcsv = csv(configuration.options);
    this.__transformer = new pgformatter(table);
  };

  var Transform = stream.Transform ||
    require('readable-stream').Transform;

  function validate (column, data) {
    if (column.type === "date") {
      var date =moment(data);
      return date.isValid();
    } else if (column.type.string !== undefined) {;
      return data.length <= column.type.string;
    } else {
      return true;
    }
  }

  function format (table, data) {
    var result = {};
    var sources = {};
    for (var key in data) {
      sources[key] = data[key];
    }
    var valid = Object.keys(table.specs.sources).every(function (sourceName){
      var valid = true;
      var value;
      var d = data[table.specs.sources[sourceName].source];
      var type = table.specs.sources[sourceName].type;
      if (type == "integer") {
        value = parseInt(d.match(/\d+/));
        if (isNaN(value)) {
          return false;
        }
      }
      sources[sourceName] = value;
      return true;
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

  source.prototype = {
    stream : function (name) {
      var request = require("request")(this.__configuration.base+"/"+name);
      var result = request.pipe(this.__fcsv).pipe(this.__transformer);
      result.name = name;
      return result;
    }
  };

  return source;
}();