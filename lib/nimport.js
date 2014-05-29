var options = require('./options');

module.exports = function () {
  var nimport = function (configuration, opts) {
    this.__configuration = options(configuration, {});
    this.__options = options(opts, {
      reporter: "console",
      verbose: false
    });
    this.__initialize();
  };

  nimport.reporter = {
    "console": require(__dirname + "/reporters/console")
  };
  nimport.runner = require(__dirname + "/runner");
  nimport.source = require(__dirname + "/sources");
  nimport.database = require(__dirname + "/databases");

  nimport.prototype = {
    __internals: undefined,
    __initialize: function () {
      this.__internals = {};
    },
    reporter: function () {
      return this.__internals.reporter || (this.__internals.reporter = new(nimport.reporter[this.__options.reporter])(this.__options));
    },
    database: function () {
      return this.__internals.database || (this.__internals.database = new nimport.database(this.__configuration.database, this.reporter()));
    },
    tables: function () {
      return this.__internals.tables || (this.__internals.tables = this.__configuration.tables || []);
    },
    sources: function (table) {
      if (this.__configuration.source && this.__configuration.source.map[table.specs.name]) {
        var source = new nimport.source(this.__configuration.source, table);
        return this.__configuration.source.map[table.specs.name].map(source.stream, source);
      } else {
        return [];
      }
    },
    run: function () {
      return (new nimport.runner(this));
    }
  };

  nimport.run = function (configuration, options) {
    var nim = new nimport(configuration, options);
    return nim.run();
  };

  return nimport;
}();