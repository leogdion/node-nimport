node-nimport
============
A node module for importing data from the web.

## Installation
  ``npm install nimport --save``
  
## Usage

### Command Line

  ``nimport configuration.json``

### Code

```javascript
  var nimport = require('nimport');
  nimport.run(require("configuration.json"));
  
  run.on("error", function (error) {
    console.log(error);
    process.exit(1);
  });

  run.on("end", function () {
    process.exit(0);
  });
```
## Configuration
  
  Coming Soon...

```json
{
  "database":{
    "database":"bls_ap",
    "user":"bls_ap_user",
    "password":"bls_ap_pw",
    "dialect":"postgres"
  },
  "source":{
    "base":"http://download.bls.gov/pub/time.series/",
    "map":{
      "series":["ap/ap.series"],
      "data":["ap/ap.data.1.HouseholdFuels", "ap/ap.data.2.Gasoline","ap/ap.data.3.Food"],
      "area":["ap/ap.area"],
      "item":["ap/ap.item"]
    },
    "options":{
      "delimiter":"\t",
      "trim":true,
      "headers":true,
      "_ignoreEmpty":true
    }
  },
  "tables":[
  {
    "name":"area",
    "schema":"ap",
    "primaryKey":["code"],
    "columns":{
      "code" : {
        "source":"area_code",
        "type": {
          "string" : 4
        }
      },
      "name" : {
        "source":"area_name",
        "type": {
          "string" : 80
        }
      }
    }
  },
  {
    "name":"item",
    "schema":"ap",
    "primaryKey":["code"],
    "columns":{
      "code" : {
        "source":"item_code",
        "type": {
          "string" : 7
        }
      },
      "name" : {
        "source":"item_name",
        "type": {
          "string" : 100
        }
      }
    }
  },
  {
      "name":"data",
      "schema":"ap",
      "primaryKey":["seriesId", "date"],
      "sources":{
        "r_year":{
          "type":"integer",
          "source":"year"
        },
        "r_month":{
          "type":"integer",
          "source":"period"
        }
      },
      "columns":{
        "seriesId":{
          "source":"series_id",
          "type":{
            "string":17
          }
        },
        "date":{
          "value" : {
            "year" : "{{r_year}}",
            "month" : "{{r_month}}",
            "day" : 1
          },
          "options" : {
            "first" : 1
          },
          "type":"date"
        },
        "value":{
          "source":"value",
          "type":"float"
        }
      }
    },
    {
      "name":"series",
      "schema":"ap",
      "primaryKey":["seriesId"],
      "sources":{
        "beginYear":{
          "type":"integer",
          "source":"begin_year"
        },
        "beginPeriod":{
          "type":"integer",
          "source":"begin_period"
        },
        "endYear":{
          "type":"integer",
          "source":"end_year"
        },
        "endPeriod":{
          "type":"integer",
          "source":"end_period"
        }
      },
      "columns":{
        "seriesId":{
          "source":"series_id",
          "type":{
            "string":17
          }
        },
        "areaCode":{
          "source":"area_code",
          "type":{
            "string":4
          }
        },
        "itemCode":{
          "source":"item_code",
          "type":{
            "string":6
          }
        },
        "beginDate":{
          "value" : {
            "year" : "{{beginYear}}",
            "month" : "{{beginPeriod}}",
            "day" : 1
          },
          "options" : {
            "first" : 1
          },
          "type":"date"
        },
        "endDate":{
          "value" : {
            "year" : "{{endYear}}",
            "month" : "{{endPeriod}}",
            "day" : 1
          },
          "options" : {
            "first" : 1
          },
          "type":"date"
        }
      }
    }
  ]
}
```

## Tests

  ``npm test``
  
## Release History

* 0.1.0 Initial release