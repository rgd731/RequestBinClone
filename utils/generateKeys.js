const cryptoKey = require("crypto");

function generateKey() {
  return cryptoKey.randomBytes(10).toString("hex");
}

module.exports = { generateKey };
