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
    console.log(type);
    var keys = Object.keys(type);
    if (keys[0] === "string") {
      return "VARCHAR(" + type[keys[0]] + ")";
    }
  }
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
  indicies : ["areaCode", "itemCode"],
  sources : {
    beginYear : {
      type : "integer"
    },
    beginYear : {
      type : "integer"
    },
    beginYear : {
      type : "integer"
    },
    beginYear : {
      type : "integer"
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
      format: "{beginYear}-{beginPeriod}-01",
      type: "date"
    },
    endDate : {
      format: "{endYear}-{endPeriod}-01",
      type: "date"
    }
  }
};

var query = "CREATE TABLE " + table.name + " (\n";
query += Object.keys(table.columns).map(function (value) {
  var column = table.columns[value];
  return [value, pgtypename(column.type), column.nullable?"NULL":"NOT NULL"].join(" ");
}).join(",\n") + "\n);";


console.log(query);