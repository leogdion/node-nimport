var moment = require('moment');
module.exports = function (options) {
  return {
    format: function (value) {
      return value;
    },
    validate: function (value) {
      return moment(value).isValid();
    },
    pgtype: function () {
      return "DATE";
    }
  };
};