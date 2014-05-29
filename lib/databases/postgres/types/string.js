var moment = require('moment');
module.exports = function (options) {
  return {
    format: function (value) {
      return value;
    },
    validate: function (value) {
      return true;
    },
    pgtype: function () {
      return "VARCHAR(" + (options.string || options.length) + ")";
    }
  };
};