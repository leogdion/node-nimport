var first = require('./first');
var should = require('chai').should();

describe('root', function(){
    it('should not return an error', function(){
      first().should.match(/gulp\.js$/);
    });
})