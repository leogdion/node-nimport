var options = require('./options');

module.exports = function () {
  var nimport = function (configuration, opts) {
    this.__configuration = configuration;
    this.__options = options(opts, {
      reporter: "console"
    });
    this.__initialize();
  };

  nimport.source = require(__dirname + "/sources");
  nimport.database = require(__dirname + "/databases");

  nimport.prototype = {
    __internals: undefined,
    __initialize: function () {
      this.__internals = {};
    },
    run: function () {

    },
    database: function () {
      return this.__internals.database || (this.__internals.database = new nimport.database(this.__configuration.database));
    },
    tables: function () {
      return this.__internals.tables || (this.__internals.tables = this.__configuration.tables || []);
    },
    sources: function (table) {
      if (this.__configuration.source) {
        var source = new nimport.source(this.__configuration.source, table);
        return this.__configuration.source.map[table.specs.name].map(source.stream, source);
      } else {
        return [];
      }
    }
  };

  return nimport;
}();