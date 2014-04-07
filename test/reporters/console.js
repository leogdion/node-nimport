var reporter = require('../../lib/reporters/console');
var should = require('chai').should();

describe("reporters", function () {
  describe("console", function () {
    var r = new reporter({
      _log: [],
      log: function (txt) {
        this._log.push(txt);
      }
    });
    describe("#constructor", function () {
      it("should not be null", function () {
        return reporter.should.not.be.null;
      });
    });
    describe("#start", function () {
      it("should work", function () {
        r.start("test", "test", "test");
      });
    });
    describe("#stop", function () {
      it("should work", function () {
        r.stop("test", "test", "test");
      });
    });
    describe("#start", function () {
      it("should work", function () {
        r.error("test", "test");
      });
    });
  });
});