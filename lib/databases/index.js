var options = require(__dirname + '/../options'),
    root = require(__dirname + '/../root');

module.exports = function () {
  var database = function (configuration) {
    configuration = options(configuration, {
      "user": process.env.USER || process.env.USERNAME || "node",
      "database": root().name()
    });
    configuration.dialect = configuration.dialect || 'postgres';
    var dialect = require(__dirname + "/" + configuration.dialect);
    this.__database = new dialect(configuration);
  };

  database.prototype = {
    __database: undefined,
    connect: function (callback) {
      this.__database.connect(callback);
    }
  };

  return database;
}();