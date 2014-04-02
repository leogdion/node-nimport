var nimport = require('../lib/nimport.js');

var nim = new nimport(require("./configuration.json"));
nim.database().connect(function (err, client) {
  nim.tables().forEach(function (table) {
    client.table(table, function (error, table) {
      console.log(table);
      nim.sources(table.name).forEach(function (source) {
        source.pipe(table.dest());
      });
    });
  });
});