module.exports = function () {
  var reporter = function (logger) {
    this.__statuses = {};
  };

  reporter.prototype = {
    __statuses: undefined,
    start: function (name, type, status) {
      name = name || "undefined";
      this.__statuses[name + ":" + type] = status;
    },
    stop: function (name, type, error) {
      name = name || "undefined";
      delete this.__statuses[name + ":" + type];
    },
    error: function (name, type) {
      name = name || "undefined";
      delete this.__statuses[name + ":" + type];
    },
  };

  return reporter;
}();