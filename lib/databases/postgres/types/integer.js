var moment = require('moment');
module.exports = function (options) {
  return {
    format: function (value) {
      return typeof value === "string" ? parseInt(value.match(/\d+/)) : value;
    },
    validate: function (value) {
      return typeof value === 'number' && !isNaN(value);
    },
    pgtype: function (value) {
      return "INTEGER";
    }
  };
};