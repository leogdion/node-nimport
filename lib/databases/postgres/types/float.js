var moment = require('moment');
module.exports = function (options) {
  return {
    format: function (value) {
      return (typeof value) === "string" ? parseFloat(value.match(/\d*\.\d*/)) : value;
    },
    validate: function (value) {
      return typeof value === 'number' && !isNaN(value);
    },
    pgtype: function (value) {
      return "FLOAT";
    }
  };
};