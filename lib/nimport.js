module.exports = function () {
  var nimport = function (configuration, options) {
    if (configuration.error) {
      this.error = configuration.error;
    }
  };

  nimport.build = function (configuration, options) {

  };

  nimport.loadFile = function (fileName, options, req) {
    req = req || require;
    var configuration;
    try {
      configuration = req(fileName);
    }
    catch (ex) {
      if (ex.code === "MODULE_NOT_FOUND") {
        return new nimport({
          error: {
            text: "configuration file does not exist.",
            code: "FILE_NOT_FOUND"
          }
        });
      } else {
        throw ex;
      }
    }
    return new nimport(configuration, options);
  };

  return nimport;
}();