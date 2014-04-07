#!/usr/bin / env node

var nimport = require('../lib/nimport'),
    minimist = require('minimist');

var nimrun = nimport.run(minimist(process.argv.slice(2))._[0], {
  reporter: "console"
});

nimrun.on("error", function (error) {
  console.log(error.text);
});

nimrun.on("end", function () {
  process.exit(0);
});