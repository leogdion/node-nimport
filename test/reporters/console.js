var reporter = require('../../lib/reporters/console');
var should = require('chai').should();

describe("reporters", function () {
  describe("console", function () {
    var r = new reporter({
      logger: {
        __log: [],
        log: function (txt) {
          this.__log.push(txt);
        }
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
    describe("#error", function () {
      it("should work", function () {
        r.error("test", "test");
      });
    });
    describe("#verbose", function () {
      it("should not work", function () {
        r.__verbose = false;
        r.logger.__log = [];
        r.verbose("__verbose", "test", "test");
        should.not.exist(r.logger.__log.pop());
      });
      it("should work", function () {
        r.__verbose = true;
        r.logger.__log = [];
        r.verbose("__verbose", "test", "test");
        r.logger.__log.pop().should.match(/__verbose/);
      });
    });
  });
});