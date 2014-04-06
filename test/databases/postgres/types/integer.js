var should = require('chai').should();
var integer = require('../../../../lib/databases/postgres/types/integer.js')();

describe('types', function () {
  describe("#integer", function () {
    describe("#format", function () {
      it('should format the date', function () {
        var value = Math.random();
        integer.format(value).should.equal(value);
      });
    });
    describe("#validate", function () {
      it('should validate the date', function () {
        return integer.validate("foo").should.be.false && integer.validate(12).should.be.true;
      });
    });
    describe("#pgtype", function () {
      it('should return the correct postgres date', function () {
        integer.pgtype().should.equal("INTEGER");
      });
    });
  });
});