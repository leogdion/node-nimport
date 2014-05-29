var should = require('chai').should();
var string = require('../../../../lib/databases/postgres/types/string.js');

describe('types', function () {
  describe("#integer", function () {
    describe("#format", function () {
      it('should format the date', function () {
        string().format("foo").should.equal("foo");
      });
    });
    describe("#validate", function () {
      it('should validate the date', function () {
        return string().validate("foo").should.be.true;
      });
    });
    describe("#pgtype", function () {
      it('should return the correct postgres type for string', function () {
        var lens = [Math.random(), Math.random(), Math.random()];
        lens.forEach(function (value) {
          string({
            "string": value
          }).pgtype().should.equal("VARCHAR(" + value + ")");
        });
      });
      it('should return the correct postgres type for string', function () {
        var lens = [Math.random(), Math.random(), Math.random()];
        lens.forEach(function (value) {
          string({
            "length": value
          }).pgtype().should.equal("VARCHAR(" + value + ")");
        });
      });
    });
  });
});