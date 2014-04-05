var first = require('./first');
var should = require('chai').should();

describe('root', function () {
  it('should not return an error', function () {
    first().filename.should.match(/(gulp||_mocha)(\.js)?$/);
  });
  it('should not return an error', function () {
    first().name().should.match(/(gulp||_mocha)/);
  });
});