var nimport = require("../lib/nimport.js");

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
  describe('#loadFile()', function(){
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