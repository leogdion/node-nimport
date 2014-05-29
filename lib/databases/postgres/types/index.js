var path = require('path');
fs = require('fs');
module.exports = function () {
  var exports = function (type) {
    return exports.evaluate.call(this, type);
  };

  fs.readdirSync(__dirname).forEach(function (file) {
    exports[path.basename(file, '.js')] = require(__dirname + "/" + file);
  });

  exports.evaluate = function (type) {
    if (typeof(type) === "string") {
      return exports[type](type);
    } else {
      return exports[Object.keys(type)[0]](type);
    }
  };
  return exports;
}();