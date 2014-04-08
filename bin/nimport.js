#!/usr/bin / env node

var nimport = require('../lib/nimport');
var argv = require('minimist')(process.argv.slice(2), {
  "default": {
    "reporter": "console"
  }
});
var path = require('path');
var run = nimport.run(require(path.resolve(argv._[0])), {
  reporter: argv.reporter
});

run.on("error", function (error) {
/*
  if (error.message) {
    console.log(error.message);
  } else {
    console.log(error);
  }
  */
  process.exit(1);
});

run.on("end", function () {
  process.exit(0);
});