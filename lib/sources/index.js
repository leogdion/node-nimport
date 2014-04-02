module.exports = function () {
  var source = function (configuration) {
    this.__configuration = configuration;
  };

  source.prototype = {
    stream : function (name) {
      
    }
  };

  return source;
}();