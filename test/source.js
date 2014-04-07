var source = require("../lib/sources");
var should = require('chai').should();

describe('sources', function () {
  it('should have correct properties', function () {
    var src = new source({
      "foo": "bar"
    });
    src.__configuration.foo.should.equal("bar");
    src.__fcsv.should.be.an.instanceof(require('stream'));
  });
});