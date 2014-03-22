#!/usr/bin / env node

var nimport = require('../lib/nimport'),
    minimist = require('minimist');

var nim = nimport.loadFile(minimist(process.argv.slice(2))._[0], {
  reporter: "console"
});

if (nim.error) {
  console.log(nim.error.text);
}