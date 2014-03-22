#!/usr/bin / env node

var nimport = require('../lib/nimport'),
    minimist = require('minimist');

var nim = nimport.load(minimist(process.argv.slice(2))._, {
  reporter: "console"
});