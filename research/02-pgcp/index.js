var pg = require('pg.js');
var copyFrom = require('pg-copy-streams').from;
var copyTo = require('pg-copy-streams').to;
var request = require('request');
var multiline = require('multiline');
var csv = require("fast-csv");
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
  // init Transform
  Transform.call(this, options);
  this._writableState.objectMode = true;
  this._readableState.objectMode = false;
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
  var data = [
    []
  ];
  for (var index = 0; index < this._keys.length; index++) {
    data[0][index] = chunk[this._keys[index]] || '';
  }
  this.push(new Buffer(csv.writeToString(data) + "\n"), enc);
  cb();
};

pgformatter.prototype._flush = function (cb) {
  this.push(new Buffer("\\.\n"));
  cb();
};

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
*/
    });
    client.query(query, function (err, results) {
      if (!err) {
        var req = request("http://download.bls.gov/pub/time.series/ap/ap.series");
        var pgstream = client.query(copyFrom("COPY ap_series FROM STDIN with CSV"));
        var fcsv = csv({
          delimiter: '\t',
          trim: true,
          headers: true,
          ignoreEmpty: true
        });
        req.pipe(fcsv).pipe(pgformatter()).pipe(pgstream);//.pipe(process.stdout);
        pgstream.on('end', function () {
          done();
          process.exit(0);
        });
        pgstream.on('error', function (error) {
          console.log(error);
          done();
          process.exit(0);
        });

      } else {
        console.log(err);
        done();
      }
    });
  });
