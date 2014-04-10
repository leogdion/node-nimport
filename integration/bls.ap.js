var pg = require('pg.js');
var request = require('request');
var async = require('async');
var csv = require('fast-csv');

function numberWithCommas(n) {
  var parts = n.toString().split(".");
  return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function zero(n) {
  var parts = n.toString().split(".");
  if (parts.length === 1) {
    return n + ".0";
  } else {
    return n;
  }
}

var coptions = {
  "delimiter": "\t",
  "trim": true,
  "headers": true,
  "_ignoreEmpty": true
};

var urls = {
  "base": "http://download.bls.gov/pub/time.series/",
  "data": ["ap/ap.data.1.HouseholdFuels", "ap/ap.data.2.Gasoline", "ap/ap.data.3.Food"]
};
var streams = 0;
var rowCount = 0,
    totalRowCount;
var querytext = "select value from ap.data where seriesid = $1 and date = $2";
var name = "search value";
var percent = 0;
var queries = 0;
pg.connect({
  "database": "bls_ap",
  "user": "bls_ap_user",
  "password": "bls_ap_pw",
  "dialect": "postgres"
}, function (error, client, done) {
  client.query("select count(*) from ap.data", function (err, result) {

    totalRowCount = result.rows[0].count;

    async.each(urls.data.map(function (_) {
      return urls.base + _
    }), function (url, cb) {
      streams++;
      var csvstream = csv(coptions);
      csvstream.on('record', function (data) {
        if (data.value) {
          var query = client.query({
            text: querytext,
            name: name,
            values: [
            data.series_id, [data.year, data.period.match(/\d+/), "01"].join('-')]
          });
          queries++;
          query.on('row', function (row, result) {
            result.addRow(row);
          });
          query.on('end', function (result) {
            queries--;
            delete querytext;
            if (result.rowCount !== 1) {
              cb(result.rowCount + " rows returned");
            } else if (result.rows[0].value !== parseFloat(data.value)) {
              cb([result.rows[0].value, data.value].join("!="));
            } else {
              rowCount++;
              if (Math.floor(rowCount / totalRowCount * 1000) / 10 > percent && rowCount < totalRowCount) {
                percent = Math.floor(rowCount / totalRowCount * 1000) / 10;
                console.log(zero(percent) + "% : " + numberWithCommas(queries) + " active queries : " + streams + " active streams");
              } else if (rowCount >= totalRowCount && queries === 0 && streams === 0) {
                done();
                process.exit(0);
              } else if (rowCount >= totalRowCount && streams === 0) {
                console.log(zero(percent) + "% : " + numberWithCommas(queries) + " active queries : " + streams + " active streams");
              }
            }
          });
        }
      });
      csvstream.on('end', function () {
        streams--;
        console.log(zero(percent) + "% : " + numberWithCommas(queries) + " active queries : " + streams + " active streams");
        //cb();
      });
      request(url).pipe(csvstream);
    }, function (error) {
      done();
      if (error) {
        console.log(error);
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
  });
});