function strRandom(o) {
  var a = 10,
    b = "abcdefghijklmnopqrstuvwxyz",
    c = "",
    d = 0,
    e = "" + b;
  if (o) {
    if (o.length) {
      a = o.length;
    }
    if (o.includeUpperCase) {
      e += b.toUpperCase();
    }
    if (o.includeNumbers) {
      e += "1234567890";
    }
  }
  for (; d < a; d++) {
    c += e[Math.floor(Math.random() * e.length)];
  }
  return c;
}

module.exports = strRandom;
