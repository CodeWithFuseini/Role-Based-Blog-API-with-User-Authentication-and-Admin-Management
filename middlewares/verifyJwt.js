const jwt = require("jsonwebtoken");

const verifyJwt = function verifyJwt(req, res, next) {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  jwt.verify(cookies?.jwt, process.env.REFRESH_KEY, function (err, decoded) {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded.email;
    next();
  });
};

module.exports = verifyJwt;
