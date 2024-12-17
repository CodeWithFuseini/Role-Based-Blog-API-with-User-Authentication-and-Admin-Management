const jwt = require("jsonwebtoken");

const generateRefreshToken = (email, key) => {
  return jwt.sign({ email }, key, {
    expiresIn: "1d",
  });
};

module.exports = generateRefreshToken;
