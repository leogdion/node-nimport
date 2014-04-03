var pg = require('pg.js');
var copyFrom = require('pg-copy-streams').from;
var S = require('string');

/*
CREATE DATABASE bls_ap
  WITH OWNER = bls_ap_user
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       LC_COLLATE = 'en_US.UTF-8'
       LC_CTYPE = 'en_US.UTF-8'
       CONNECTION LIMIT = -1;

CREATE ROLE bls_ap_user LOGIN
  ENCRYPTED PASSWORD 'md507a0aeec17d81033e44885da5d0eb81a'
  NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
*/

module.exports = function() {
  function query(table) {
    var query = "DROP TABLE IF EXISTS " + table.name + "; CREATE TABLE " + table.name + " (\n";
    query += Object.keys(table.columns).map(function(value) {
      var column = table.columns[value];
      return "\t" + [value, pgtypename(column.type), column.nullable ? "NULL" : "NOT NULL"].join(" ");
    }).join(",\n");
    if (table.primaryKey) {
      query += S(",\n\tCONSTRAINT {{primaryKey}}_pkey PRIMARY KEY ({{primaryKey}})").template(table);
    }
    query += "\n);";
return query;
  }

  function pgtypename(type) {
    if (typeof(type) === "string") {
      if (type === "date") {
        return "DATE";
      }
    } else {
      var keys = Object.keys(type);
      if (keys[0] === "string") {
        return "VARCHAR(" + type[keys[0]] + ")";
      }
    }
  }

  var postgres = function(configuration) {
    this.__configuration = configuration;

  };

  var client = function(pgclient, done) {
    this.__pgclient = pgclient;
  };

  var table = function(client, specs) {
    this.specs = specs;
    this.__client = client;
  };


  table.prototype.dest = function() {
    return this.__client.stream(this.specs);
  };

  client.prototype = {
    table: function(specs, callback) {
      var client = this;
      console.log(query(specs));
      this.__pgclient.query(query(specs), function (error) {
        callback(error, new table(client, specs));
      });
    },
    stream: function(specs) {
      return this.__pgclient.query(copyFrom("COPY " + specs.name + " FROM STDIN with CSV"));
    }
  };

  postgres.prototype = {

    __configuration: undefined,
    connect: function(callback) {
      var that = this;
      pg.connect(this.__configuration, function(error, pgclient, done) {
        if (error) {
          error.query = "CREATE ROLE " + that.__configuration.user + " LOGIN PASSWORD '" + that.__configuration.password + "' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION; CREATE DATABASE " + that.__configuration.database + " WITH OWNER " + that.__configuration.user + ";";
        }
        callback(error, new client(pgclient), done);
      });
    }
  };

  return postgres;
}();
