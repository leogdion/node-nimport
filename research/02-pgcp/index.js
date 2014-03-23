var pg = require('pg');
var copyFrom = require('pg-copy-streams').from;
var request = require('request');
var multiline = require('multiline');

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

        req.pipe(copyFrom("COPY ap_series FROM STDIN"));
        req.on('end', done);
        req.on('error', done);
        req.on('data', function (chunk) {
          console.log('got %d bytes of data', chunk.length);
        });
      } else {
      done();
    }
    });
//  request("http://download.bls.gov/pub/time.series/ap/ap.series")

});