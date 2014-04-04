var nimport = require("../lib/nimport.js");
var should = require('chai').should();
var req = function (path) {
  if (path === "validFile") {
    return {};
  } else {
    throw {
      code: "MODULE_NOT_FOUND"
    };
  }
};

var assert = require("assert")
describe('nimport', function(){
  describe('#constructor', function(){
    it('should not return an error', function(){
      var nim = new nimport ({});
      nim.run.should.be.a('function');
      nim.database().should.be.an.instanceOf(nimport.database);
    });
  })
})