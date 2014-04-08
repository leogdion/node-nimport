var EventEmitter = require("events").EventEmitter;
var util = require('util');
var async = require('async');

module.exports = function () {
  var runner = function (nim) {
    this.__nim = nim;
    this.start();
  };

  util.inherits(runner, EventEmitter);

  /* istanbul ignore next */
  runner.prototype.start = function () {
    var nim = this.__nim,
        reporter = nim.reporter();
    var that = this;
    nim.database().connect(function (err, client, done) {
      if (err) {
        reporter.log({
          message: err.message,
          query: err.query
        });
        that.emit("error", err);
        return;
      }
      reporter.start(client.name(), "database", "connected");
      async.each(
      nim.tables(), function (table, cb) {
        reporter.start(table.name, "table", "importing");
        var tableConfig = table;
        client.table(table, function (error, table) {
          if (error) {
            cb(error);
          }
          async.each(
          nim.sources(table), function (source, cb) {
            reporter.start(source.name, "source", "streaming");
            var stream = table.dest();

            source.pipe(stream);
            stream.on('error', function (error) {
              reporter.error(source.name, "source");
              cb(error);
            });
            stream.on('end', function () {
              reporter.stop(source.name, "source");
              cb();
            });
          }, function (error) {
            reporter.stop(tableConfig.name, "table", error);
            cb(error);
          });
        });
      }, function (error) {
        done();
        reporter.stop(client.name(), "database", error);
        if (error) {
          console.log(error);
          that.emit("error", error);
        }
        that.emit("end");
      });
    });
  };

  return runner;
}();