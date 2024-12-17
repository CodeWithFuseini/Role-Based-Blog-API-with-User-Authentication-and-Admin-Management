const jwt = require("jsonwebtoken");

const generateAccessToken = (email, key) => {
  return jwt.sign({ email }, key, {
    expiresIn: "15m",
  });
};

module.exports = generateAccessToken;
