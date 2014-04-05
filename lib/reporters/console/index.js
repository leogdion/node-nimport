module.exports = function () {
  var reporter = function (logger) {
    this.__statuses = {};
    this.console = logger || console;
  };

  reporter.prototype = {
    __statuses: undefined,
    start: function (name, type, status) {
      name = name || "undefined";
      this.__statuses[name + ":" + type] = status;
      this.logger.log(type + ": " + name + ": " + status);
    },
    stop: function (name, type, error) {
      name = name || "undefined";
      this.logger.log(type + ": " + name + (error ? "!" : "."));
      delete this.__statuses[name + ":" + type];
    },
    error: function (name, type) {
      name = name || "undefined";
      this.logger.log(type + ": " + name + "!");
      delete this.__statuses[name + ":" + type];
    },
  };

  return reporter;
}();