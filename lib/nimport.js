
module.exports = function () {
  var nimport = function (configuration, options) {
    this.__internals = {};
    this.configuration = configuration;
  };

  nimport.source = require(__dirname + "/sources");
  nimport.database = require(__dirname + "/databases");

  nimport.prototype = {
    __internals : undefined,
    database : function () {
      return this.__internals.database || (this.__internals.database = new nimport.database(this.configuration.database));
    },
    tables : function () {
      return this.__internals.tables || (this.__internals.tables = this.configuration.tables);
    },
    sources : function (table) {
      var source = new nimport.source(this.configuration.source, table);
      return this.configuration.source.map[table.specs.name].map(source.stream, source);
    }
  };

  return nimport;
}();