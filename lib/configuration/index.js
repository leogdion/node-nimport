module.exports = function () {
  var configuration = function (json) {
    this.database = json.database;
  };

  configuration.prototype = {
    database : undefined
  }

  return configuration;
}();