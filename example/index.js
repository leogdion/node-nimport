var nimport = require('../lib/nimport.js');
var async = require('async');
//var nim = new nimport(require("./configuration.json"),{reporter : "console"});

var nim = new nimport();
var run = nim.run();

run.on("error", function (error) {
  console.log(error.text);
  process.exit(1);
});

run.on("end", function () {
  process.exit(0);
});
/*
var reporter = {
  __statuses : {},
  start : function (name, type, status) {
    name = name || "undefined";
    this.__statuses[name+":"+type] = status;
    console.log(type+": "+name+": "+status);
  },
  stop : function (name, type, error) {
    name = name || "undefined";
    console.log(type+": "+name+(error?"!":"."));
    delete this.__statuses[name+":"+type];
  },
  error: function (name, type) {
    name = name || "undefined";
    console.log(type+": "+name+"!");
    delete this.__statuses[name+":"+type];
  },
};

nim.database().connect(function (err, client, done) {
  if (err) {
    console.log(err.query);
    process.exit(1);
  }
  reporter.start(undefined, "database", "connected");
  async.each(
    nim.tables(),
    function (table, cb) {
      reporter.start(table.name, "table", "importing");
      var tableConfig = table;
      client.table(table, function (error, table) {
        if (error) {
          cb(error);
        }
        async.each(
          nim.sources(table),
          function (source, cb) {
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
          },
          function (error) {
            reporter.stop(tableConfig.name, "table", error);
            cb(error);
          }
        );
      });
    },
    function (error) {
      done();
      reporter.stop(undefined, "database", error);
      if (error) {
        console.log(error);
        process.exit(1);
      }
      process.exit(0);
    }
  );
});
*/