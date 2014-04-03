var nimport = require('../lib/nimport.js');

var nim = new nimport(require("./configuration.json"));
nim.database().connect(function (err, client, done) {
  if (err) {
    console.log(err.query);

    process.exit(1);
  }
  nim.tables().forEach(function (table) {
    client.table(table, function (error, table) {
      if (error) {
        console.log(error);
        process.exit(1);
      }
      nim.sources(table).forEach(function (source) {
        var stream = table.dest();

        source.pipe(stream);
        stream.on('error', function (error) {
          console.log(error);
          process.exit(1);
        });
        stream.on('end', function () {
          console.log("TEST");
        });
      });
    });
  });
  done();
});