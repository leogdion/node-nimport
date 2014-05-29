var types = require("./types");
var S = require('string');
var options = require('../../options');

module.exports = function () {
  return {
    table: {
      create: function (table) {
        table = options(table, {
          schema: "public"
        });
        var primaryKey;
        if (table.primaryKey) {
          primaryKey = {};
          if (Array.isArray(table.primaryKey)) {
            primaryKey.name = table.name + "_pkey";
            primaryKey.values = table.primaryKey;
          }
          else if (typeof table.primaryKey === "object") {
            primaryKey.name = function (o) {
              for (var key in o) {
                return key;
              }
            }(table.primaryKey);
            primaryKey.values = table.primaryKey[primaryKey.name];
          }
          else if (typeof table.primaryKey === "string") {
            primaryKey.name = table.primaryKey + "_pkey";
            primaryKey.values = [table.primaryKey];
          }
        }
        var _ = "DROP TABLE IF EXISTS " + table.schema + "." + table.name + "; CREATE TABLE " + table.schema + "." + table.name + " (\n";
        _ += Object.keys(table.columns).map(function (value) {
          var column = table.columns[value];
          return "\t" + [value, types(column.type).pgtype(), column.nullable ? "NULL" : "NOT NULL"].join(" ");
        }).join(",\n");
        if (primaryKey) {
          _ += S(",\n\tCONSTRAINT {{name}} PRIMARY KEY ({{values}})").template(primaryKey);
        }
        _ += "\n);";
        return _;
      },
      stream: function (table) {
        table = options(table, {
          schema: "public"
        });
        return "COPY " + table.schema + "." + table.name + " FROM STDIN with CSV";
      }
    },
    schema: {
      create: function (table) {
        return "CREATE SCHEMA IF NOT EXISTS " + table.schema + ";";
      }
    },
    database: {
      create: function (database) {
        return "CREATE ROLE " + database.user + " LOGIN PASSWORD '" + database.password + "' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION; CREATE DATABASE " + database.database + " WITH OWNER " + database.user + ";";
      }
    }
  };
}();