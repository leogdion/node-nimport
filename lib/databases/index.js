module.exports = function () {
  var database = function (configuration) {
    var dialect = require(__dirname + "/" + configuration.dialect);
    this.__database = new dialect(configuration);
  };

  database.prototype = {
    __database : undefined,
    connect : function (callback) {
      this.__database.connect(callback);
    }
  };

  return database;
}();