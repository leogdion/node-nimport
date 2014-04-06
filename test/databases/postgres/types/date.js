var should = require('chai').should();
var date = require('../../../../lib/databases/postgres/types/date.js')();

describe('types', function () {
  describe("#date", function () {
    describe("#format", function () {
      it('should format the date', function () {
        var value = Math.random();
        date.format(value).should.equal(value);
      });
    });
    describe("#validate", function () {
      it('should validate the date', function () {
        return date.validate("foo").should.be.false && date.validate("2006-12-05").should.be.true;
      });
    });
    describe("#pgtype", function () {
      it('should return the correct postgres date', function () {
        date.pgtype().should.equal("DATE");
      });
    });
  });
});