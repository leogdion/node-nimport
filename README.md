node-nimport
============
[![Build Status](https://travis-ci.org/leogdion/node-nimport.svg?branch=release/0.1.0)](https://travis-ci.org/leogdion/node-nimport) [![Coverage Status](https://coveralls.io/repos/leogdion/node-nimport/badge.png?branch=release/0.1.0)](https://coveralls.io/r/leogdion/node-nimport?branch=release/0.1.0) [![Codeship](https://www.codeship.io/projects/68d0ee80-a706-0131-c660-26855b373a72/status?branch=release/0.1.0)](https://www.codeship.io/projects/18947)
[![HuBoard badge](http://img.shields.io/badge/Hu-Board-7965cc.svg)](https://huboard.com/leogdion/node-nimport)[![david-dm](https://david-dm.org/leogdion/node-nimport?branch=release/0.1.0)](https://david-dm.org/leogdion/node-nimport?branch=release/0.1.0)

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
  
For an example, see [this configuration](example/bls.ap.json).

### Database

```json
  {
    "database":"bls_ap",
    "user":"bls_ap_user",
    "password":"bls_ap_pw",
    "dialect":"postgres"
  }
```

The settings for the destination database. 

<dl>
<dt>database</dt>
<dd>The name of the database. The default is the base name of the configuration file.</dd>
<dt>user</dt>
<dd>The username to login with. The default is the operation system current logged in username.</dd>
<dt>password</dt>
<dd>The password to login with. The default is none.</dd>
<dt>dialect</dt>
<dd>The database type. Only postgres is supported.</dd>
</dl>

### Source

```json
{
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
}
```

<dl>
<dt>base</dt>
<dd>The base url for the files.</dd>
<dt>map</dt>
<dd>Maps the database tables to the files relative to the base url</dd>
<dt>options</dt>
<dd>Options to parse the text files into objects. See <a href="https://github.com/C2FO/fast-csv" target="_blank">fast-csv</a> for options.</dd>
</dl>

### Tables

```json
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
  "columns": {...}
}
```

<dl>
<dt>name</dt>
<dd>The name of the table.</dd>
<dt>schema <em>optional</em></dt>
<dd>The schema of the table.</dd>
<dt>primary key <em>optional</em></dt>
<dd>The primary key column of the table.</dd>
<dt>sources <em>optional</em></dt>
<dd>Parsed source data for use in destination columns. Contains <em>name</em> as key. <em>type</em> contains the destination type: <em>string, integer, float, date</em>. <em>source</em> contains the name of the column from the text source.</dd>
</dl>

#### Columns

```json
{
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
  },
  "seriesId":{
    "source":"series_id",
    "type":{
      "string":17
    }
  }
}
```

<dl>
  <dt><em>key</em></dt> <dd>The name of the destination column in the table.</dd>
  <dt>value</dt> <dd>For structured data (i.e. <em>date</em>) this maps the sources to the data type. For date see <a href="http://momentjs.com/docs/#/parsing/object/" target="_blank">moment.js documentation</a>. Note assumes UTC for time zone.</dd>
  <dt>source</dt> <dd>For simple data (i.e. <em>string,integer,float</em>) this maps the sources to the data type.</dd>
  <dt>options</dt> <dd>Options for the converting the value. <em>first</em> tells the date type to parse month <em>1</em> as January.</dd>
  <dt>type</dt><dd>Tells the destination type which is either <em>string,integer,float,</em> or <em>date</em>. For string it assumes 255 maximum length unless a key-value is used with string as key, then the value is used as maximum length.</dd>
</dl>

## Tests

  ``npm test``
  
## Release History

* 0.1.0 Initial release
