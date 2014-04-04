var nimport = require("../lib/nimport.js");
var should = require('chai').should();

var nims = [];

var assert = require("assert")
describe('nimport', function(){
  describe('#constructor', function(){
    it('should be a nimport', function(){
      nims[0] = new nimport ({});
      nims[0].should.be.instanceof(nimport);
    });
  });
  describe('#run', function(){
    it('run should be a function', function(){
      nims[0].run.should.be.a('function');
    });
  });
  describe('#database', function(){
    it('database should be a database', function(){
      nims[0].database().should.be.an.instanceOf(nimport.database);
    });
  });
  describe('#tables', function(){
    it('tables should be a tables', function(){
      //nims[0].database().should.be.an.instanceOf(nimport.database);
    });
  });
})