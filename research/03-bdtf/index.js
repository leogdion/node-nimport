var S = require('string');

var data = { series_id: 'APUX4007471A',
  area_code: 'X400',
  item_code: '7471A',
  footnote_codes: '',
  begin_year: '1998',
  begin_period: 'M01',
  end_year: '2014',
  end_period: 'M02' };

function pgtypename (type) {
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

function format (table, data) {
  var result = {};
  var sources = {};
  for (var key in data) {
    sources[key] = data[key];
  }
  Object.keys(table.sources).forEach(function (sourceName){
    var value;
    var d = data[table.sources[sourceName].source];
    var type = table.sources[sourceName].type;
    if (type == "integer") {
      value = parseInt(d.match(/\d+/));
    }
    sources[sourceName] = value;
  });
  Object.keys(table.columns).forEach(function (columnName) {
    var column = table.columns[columnName];
    if (column.format) {
      result[columnName] = S(column.format).template(sources).s;
    } else if (column.source) {
      result[columnName] = data[column.source];
    }
  });
  return result;
}
/*
"ap.data" : {
      "series_id" : {"string" : 17},
      "year" : {"integer" : 4},
      "period" : {"string" : 3},
      "value" : {"decimal" : [8,4]},
      "footnote_codes" : {
        "type" : {"string" : 10},
        "nullable" : "false"
      }
      */

var table = {
  name : "series",
  primaryKey: "seriesId",
  sources : {
    beginYear : {
      type : "integer",
      source: "begin_year"
    },
    beginPeriod : {
      type : "integer",
      source: "begin_period"
    },
    endYear : {
      type : "integer",
      source: "end_year"
    },
    endPeriod : {
      type : "integer",
      source: "end_period"
    }
  },
  columns : {
    seriesId: {
      source : "series_id",
      type : {"string" : 17}
    },
    areaCode : {
      source: "area_code",
      type : {"string" : 4}
    },
    itemCode : {
      source: "item_code",
      type : {"string" : 4}
    },
    beginDate : {
      format: "{{beginYear}}-{{beginPeriod}}-01",
      type: "date"
    },
    endDate : {
      format: "{{endYear}}-{{endPeriod}}-01",
      type: "date"
    }
  }
};

var query = "CREATE TABLE " + table.name + " (\n";
query += Object.keys(table.columns).map(function (value) {
  var column = table.columns[value];
  return "\t" + [value, pgtypename(column.type), column.nullable?"NULL":"NOT NULL"].join(" ");
}).join(",\n");
if (table.primaryKey) {
  query += S(",\n\tCONSTRAINT {{primaryKey}}_pkey PRIMARY KEY ({{primaryKey}})").template(table);
}
query += "\n);";
//CONSTRAINT ap_series_pkey PRIMARY KEY (series_id)
var formatted = format(table, data);

console.log(formatted)
console.log(query);