module.exports = function (type) {
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
};