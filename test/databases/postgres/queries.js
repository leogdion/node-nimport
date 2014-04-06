/*
module.exports = function () {
  return {
    table: {
      create: function (table) {
        var _ = "DROP TABLE IF EXISTS " + table.name + "; CREATE TABLE " + table.name + " (\n";
        _ += Object.keys(table.columns).map(function (value) {
          var column = table.columns[value];
          return "\t" + [value, types(column.type).pgtype(), column.nullable ? "NULL" : "NOT NULL"].join(" ");
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
*/
var should = require('chai').should();
var queries = require('__');

describe('queries', function () {
  describe("#table", function () {
    describe("#create", function () {
      it('should create a create table query', function () {
        var query = queries.table.create({
          name: "foo",
          columns: {
            "seriesId": {
              "source": "series_id",
              "type": {
                "string": 17
              }
            }
          },
          primaryKey: "seriesId"
        });
        query.should.match(/CREATE TABLE foo/);
        query.should.match(/seriesId VARCHAR\(17\)/);
        query.should.match(/CONSTRAINT seriesId_pkey PRIMARY KEY \(seriesId\)/);
      });
    });
    describe("#stream", function () {
      it('should create a copy query', function () {
        queries.table.stream({
          name: "foo"
        }).should.equal("COPY foo FROM STDIN with CSV");
      });
    });
  });
  describe("#database", function () {
    describe("#create", function () {
      it('should create a create database query', function () {
        queries.database.create({
          user: "foo",
          password: "bar",
          database: "fez"
        }).should.equal("CREATE ROLE foo LOGIN PASSWORD 'bar' NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION; CREATE DATABASE fez WITH OWNER foo;");
      });
    });
  });
});