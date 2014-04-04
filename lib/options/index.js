module.exports = function (original, defs) {
  original = original || {};
  for (var key in defs) {
    if (original[key] === undefined) {
      original[key] = defs[key];
    }
  }
  return original;
};