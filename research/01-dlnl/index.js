var request = require('request');
var csv = require("fast-csv");
var stream = require('stream');
var util = require('util');

var Transform = stream.Transform ||
  require('readable-stream').Transform;

var separator = function (options) {
  console.log(this);
  // allow use without new
  if (!(this instanceof separator)) {
    return new separator(options);
  }
  options = options || {};
  options.objectMode = true;

  // init Transform
  Transform.call(this, options);
};

util.inherits(separator, Transform);

separator.prototype._transform = function (chunk, enc, cb) {

  //var upperChunk = chunk.toString();
  this.push(chunk, enc);
  cb();
};

request("http://download.bls.gov/pub/time.series/ap/ap.series").pipe(csv({delimiter : '\t', trim: true, headers : true})).pipe(separator()).pipe(process.stdout);