var options = require("../lib/options");
var should = require('chai').should();

describe('options', function(){
    it('should return merged object', function(){
      var original = {
        original : Math.random(),
        both: Math.random()
      };
      var def = {
        def: Math.random(),
        both : Math.random()
      };
      var opts = options(original, def);

      opts.original.should.be.equal(original.original);
      opts.both.should.be.equal(original.both);
      opts.def.should.be.equal(def.def);
    });
})