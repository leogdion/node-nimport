var pg = require('pg.js');

module.exports = function () {
  var postgres = function (configuration) {
    this.__configuration = configuration;
    
  };

  var client = function () {

  };

  var table = function (specs) {
    this.name = specs.name;
  };

  table.prototype.dest = function () {

  };

  client.prototype = {
    table : function (specs, callback) {
      callback(undefined, new table (specs));
    }
  };

  postgres.prototype = {

    __configuration : undefined,
    connect : function (callback) {
      callback(undefined, new client());
    }
  };
  
  return postgres;
}();