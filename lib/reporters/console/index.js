module.exports = function () {
  var reporter = function (options) {
    this.__statuses = {};
    this.logger = options.logger || console;
    this.__verbose = options.verbose;
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
    verbose: function (name, type, message) {
      if (this.__verbose) {
        this.logger.log(type + "(" + name + "): " + message);
      }
    },
    log: function (message) {
      this.logger.log(typeof message == "string" ? message : message.message);
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