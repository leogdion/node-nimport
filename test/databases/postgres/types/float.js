var should = require('chai').should();
var flt = require('../../../../lib/databases/postgres/types/float.js')();

describe('types', function () {
  describe("#float", function () {
    describe("#format", function () {
      it('should format the float', function () {
        var value = Math.random();
        flt.format(value).should.equal(value);
      });
      it('should format the float', function () {
        var value = Math.random();
        flt.format("pre" + value.toString() + "post").should.equal(value);
      });
    });
    describe("#validate", function () {
      it('should validate the float', function () {
        return flt.validate("foo").should.be.false && flt.validate(12).should.be.true && flt.validate(" ").should.be.false && flt.validate(undefined).should.be.false;
      });
    });
    describe("#pgtype", function () {
      it('should return the correct postgres float', function () {
        flt.pgtype().should.equal("FLOAT");
      });
    });
  });
});