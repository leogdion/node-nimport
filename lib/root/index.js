module.exports = function() {
    for (var i = 0; i < process.argv.length; i++) {
     if (process.argv[i] !== 'node') {
      return process.argv[i];
     }
    };
};