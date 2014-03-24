var pg = require('pg');
var copyFrom = require('pg-copy-streams').from;
var request = require('request');
var multiline = require('multiline');
var csv = require("fast-csv");
var async = require("async");
var util = require('util');
var stream = require('stream');
var fs = require('fs');

var Transform = stream.Transform ||
  require('readable-stream').Transform;

var pgformatter = function (options) {
  // allow use without new
  if (!(this instanceof pgformatter)) {
    return new pgformatter(options);
  }
  options = options || {};
  options.objectMode = true;
  // init Transform
  Transform.call(this, options);
};

util.inherits(pgformatter, Transform);

pgformatter.prototype._transform = function (chunk, enc, cb) {
  chunk = JSON.parse(chunk.toString());

  if (!chunk.end_period) {
    this.push(new Buffer(0), enc);
    cb();
    return;
  }
  this._keys = this._keys || Object.keys(chunk);
  var data = [[]];
  for (var index = 0; index < this._keys.length; index++) {
    data[0][index] = chunk[this._keys[index]] || '';
  }
  this.push(new Buffer(csv.writeToString(data) + "\n\\.\n"), enc);
  //var upperChunk = chunk.toString();
  //this.push(chunk, enc);
  cb();
};

pgformatter.prototype._flush = function (cb) {
  console.log("pg_flush");
  this.push(new Buffer("\\.\n"));
  cb();
};

//pg.connect("postgres://hoxcsbmwyabkgj:nExK-2u-lH5P4MD_NJncWBkYmP@ec2-107-20-214-225.compute-1.amazonaws.com/d223u8de66gvu4?ssl=true",
  pg.connect("postgres://nimr02_user:test@localhost/nimr02",
  function (err, client, done) {
    var query = multiline(function () {
      /*
      drop table if exists ap_series;
      create table ap_series (
    series_id char(17) NOT NULL,
    area_code char(4) NOT NULL,
    item_code char(7) NOT NULL,
    footnote_codes char(10),
    begin_year integer NOT NULL,
    begin_period char(3) NOT NULL,
    end_year integer NOT NULL,
    end_period char(3) NOT NULL
    );
  */});
    console.log(query);
    client.query(query, function (err, results) {
      if (!err) {
        var file = fs.createWriteStream('ap.series.tmp.csv');
        var read = fs.createReadStream('ap.series.csv');
        var req = request("http://download.bls.gov/pub/time.series/ap/ap.series");
        var pgstream = copyFrom("COPY ap_series FROM STDIN with CSV");
        var fcsv = csv({delimiter : '\t', trim: true, headers : true, ignoreEmpty: true});
       
        //var formatter = pgformatter();
        //req.pipe(fcsv).pipe(pgformatter()).pipe(pgstream);//.pipe(process.stdout);
        read.pipe(pgstream);
        pgstream.on('end', done);
        pgstream.on('error', done);
        
      } else {
      done();
    }
    });
//  request("http://download.bls.gov/pub/time.series/ap/ap.series")

});