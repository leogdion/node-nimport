var moment = require('moment'),
    S = require('string');
module.exports = function (options) {
  return {
    format: function (value) {
      var obj = {},
          time;
      if (options && options.value) {
        for (var key in options.value) {
          var data;
          var fieldValue = options.value[key];
          if (typeof fieldValue === "string") {
            data = S(fieldValue).template(value).s;
          } else {
            data = options.value[key];
          }
          obj[key] = data;
        }
        if (options.options && options.options.first) {
          obj.month = obj.month - options.options.first;
        }
        time = moment.utc(obj);
      } else {
        time = moment.utc(value);
      }
      if (!time.isValid()) {
        console.log(obj);
      }
      return time.isValid() ? time.format() : undefined;
    },
    validate: function (value) {
      return moment(value).isValid();
    },
    pgtype: function () {
      return "DATE";
    }
  };
};