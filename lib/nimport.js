
module.exports = function () {
  var nimport = function (configuration, options) {
    if (configuration.error) {
      this.error = configuration.error;
    }
    this.configuration = new nimport.configuration(configuration);
  };

  nimport.configuration = require(__dirname + "/configuration");

  nimport.prototype = {
    database : function () {
      return new (require(__dirname+"/databases"))(this.configuration);
    },
    tables : function () {

    },
    parser : function () {

    },
    formatter : function () {

    },
    source : function () {

    }
  };

  nimport.build = function (configuration, options) {
    var db = this.database();
    db.connect(function (err, conn) {
      conn.create(this.tables());
      this.source().pipe(this.parser()).pipe(this.formatter()).pipe(conn.stream());
    });
    // connect to database
      // create tables
        // create initial queries
          // run queries
      // pipe request to csv to formatter to stream
      // done
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