module.exports = function() {
  function _name () {
    return require('path').basename(this.filename, ".js");
  };
    for (var i = 0; i < process.argv.length; i++) {
     if (process.argv[i] !== 'node') {
      return {
        filename : process.argv[i],
        name : _name
      };
     }
    };
};