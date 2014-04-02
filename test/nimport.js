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
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})