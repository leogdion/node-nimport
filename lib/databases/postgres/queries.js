var pgtypename = require("./types.js");
var S = require('string');

module.exports = function () {
  return {
    table: {
      create: function (table) {
        var _ = "DROP TABLE IF EXISTS " + table.name + "; CREATE TABLE " + table.name + " (\n";
        _ += Object.keys(table.columns).map(function (value) {
          var column = table.columns[value];
          return "\t" + [value, pgtypename(column.type), column.nullable ? "NULL" : "NOT NULL"].join(" ");
        }).join(",\n");
        if (table.primaryKey) {
          _ += S(",\n\tCONSTRAINT {{primaryKey}}_pkey PRIMARY KEY ({{primaryKey}})").template(table);
        }
        _ += "\n);";
        return _;
      },
      stream: function (table) {
        return "COPY " + table.name + " FROM STDIN with CSV";
      }
    },
    database: {
      create: function (database) {
        return "CREATE ROLE " + database.user + " LOGIN PASSWORD '" + database.password + "' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION; CREATE DATABASE " + database.database + " WITH OWNER " + database.user + ";";
      }
    }
  };
}();