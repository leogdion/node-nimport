var should = require('chai').should();
var datef = require('../../../../lib/databases/postgres/types/date.js');
var date = datef();

describe('types', function () {
  describe("#date", function () {
    describe("#format", function () {
      it('should format the date obj', function () {
        var value = {
          year: 2000
        };
        date.format(value).should.match(/^2000-01-01/);
      });
      it('should format the date', function () {
        var datez = datef({
          value: {
            year: "{{y}}",
            month: "{{d}}",
            day: 12
          },
          options: {
            first: 3
          }
        });
        var value = {
          y: 2001,
          d: 5
        };
        datez.format(value).should.match(/^2001-03-12/);
      });
      it('should not format the invalid date', function () {
        var datez = datef({
          value: {
            year: "{{y}}",
            month: "{{d}}",
            day: 12
          },
          options: {
            first: 3
          }
        });
        var value = {
          y: 2001,
          d: 45
        };
        should.not.exist(datez.format(value));
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