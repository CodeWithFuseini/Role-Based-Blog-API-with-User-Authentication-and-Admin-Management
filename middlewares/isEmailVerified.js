const User = require("../models/User");

async function isEmailVerified(req, res, next) {
  const { email } = req.body;
  const foundUser = await User.findOne({ email }).lean();

  if (!foundUser?.verifiedEmail) {
    return res.status(401).json("email not verified");
  }

  next();
}

module.exports = isEmailVerified;
