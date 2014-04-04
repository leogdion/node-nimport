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

/*
exports.loadFile = {
  validFile: function (test) {
    var nim = nimport.loadFile("validFile", {}, req);
    test.strictEqual(nim.error, undefined);
    test.done();
  },
  invalidFile: function (test) {
    var nim = nimport.loadFile("invalidFile", {}, req);
    test.strictEqual(nim.error.code, "FILE_NOT_FOUND");
    test.done();
  }
};
*/
var assert = require("assert")
describe('nimport', function(){
  describe('#constructor', function(){
    it('should not return an error', function(){
      var nim = new nimport ({});
      nim.run.should.be.a('function');
      nim.database().should.be.an.instanceOf(nimport.database);
    });
    /*
    it('should not return an error', function(){
      var nim = nimport.loadFile("validFile", {}, req);
      assert.equal(undefined, nim.error);
    })
    it('should return an error', function(){
      var nim = nimport.loadFile("invalidFile", {}, req);
      assert.equal("FILE_NOT_FOUND", nim.error.code);
    })*/
  })
})