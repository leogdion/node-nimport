var moment = require('moment');
module.exports = function (options) {
  return {
    format: function (value) {

    },
    validate: function (value) {
      var date = moment(data);
      return date.isValid();
    },
    pgtype: function (value) {

    }
  };
};