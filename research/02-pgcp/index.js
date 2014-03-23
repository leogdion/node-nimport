var pg = require('pg');
var copyFrom = require('pg-copy-streams').from;
var request = require('request');
var multiline = require('multiline');
var csv = require("fast-csv");
/*
var pgformatter = function (options) {
  console.log(this);
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
  var keys = Object.keys(chunk);
  console.log(key);

  //var upperChunk = chunk.toString();
  this.push(chunk, enc);
  cb();
};
*/
//pg.connect("postgres://hoxcsbmwyabkgj:nExK-2u-lH5P4MD_NJncWBkYmP@ec2-107-20-214-225.compute-1.amazonaws.com/d223u8de66gvu4?ssl=true",
  pg.connect("postgres://nimr02_user@localhost/nimr02",
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
        var req = request("http://download.bls.gov/pub/time.series/ap/ap.series");
        var pgstream = copyFrom("COPY ap_series FROM STDIN");
        var fcsv = csv({delimiter : '\t', trim: true, headers : true});
        var ocsv = csv({headers : true})
        //var formatter = pgformatter();
        req.pipe(fcsv).pipe(ocsv).pipe(process.stdout);
        pgstream.on('end', done);
        pgstream.on('error', done);
        pgstream.on('data', function (chunk) {

          console.log('got %d bytes of data', chunk.length);
        });
      } else {
      done();
    }
    });
//  request("http://download.bls.gov/pub/time.series/ap/ap.series")

});