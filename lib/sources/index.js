var csv = require("fast-csv");
var util = require('util');
var stream = require('stream');
var fs = require('fs');

module.exports = function () {
  var source = function (configuration, table) {
    this.__configuration = configuration;
    this.__fcsv = csv(configuration.options);
  };

  source.prototype = {
    stream: function (name) { /* istanbul ignore next */
      var request = require("request")(this.__configuration.base + "/" + name);
      var result = request.pipe(this.__fcsv);
      result.name = name;
      return result;
    }
  };

  return source;
}();