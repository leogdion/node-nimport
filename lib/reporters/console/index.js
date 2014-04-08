module.exports = function () {
  var reporter = function (logger) {
    this.__statuses = {};
    this.logger = logger || console;
  };

  reporter.prototype = {
    __statuses: undefined,
    start: function (name, type, status) {
      name = name || "undefined";
      this.__statuses[name + ":" + type] = status;
      this.logger.log(type + "(" + name + "): " + status + "...");
    },
    stop: function (name, type, error) {
      name = name || "undefined";
      this.logger.log(type + "(" + name + "): " + (error ? error : "done."));
      delete this.__statuses[name + ":" + type];
    },
    error: function (name, type) {
      name = name || "undefined";
      this.logger.log(type + ": " + name + "!");
      delete this.__statuses[name + ":" + type];
    },
    log: function (message) {
      this.logger.log(message.message);
/*
      for (var key in message) {
        if (key != "message") {
          this.logger.log(key + ": " + message[key]);
        }
      }
      */
    }
  };

  return reporter;
}();