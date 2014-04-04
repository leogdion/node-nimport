var options = require("../lib/options");
var should = require('chai').should();

describe('options', function(){
      var original = {
        original : Math.random(),
        both: Math.random()
      };
      var def = {
        def: Math.random(),
        both : Math.random()
      };
      var opts = options(original, def);
    it('original should be original', function(){
      opts.original.should.be.equal(original.original);
    });
    it('both should be original', function(){
      opts.both.should.be.equal(original.both);
    });
    it('default should be default', function(){
      opts.def.should.be.equal(def.def);
    });
})