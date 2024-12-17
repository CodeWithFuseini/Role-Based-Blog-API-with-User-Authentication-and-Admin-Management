const Admin = require("../models/Admin");

function isAdmin(req, res, next) {
  const status = req.session.adminStatus;

  if (status !== "20388") {
    return res.status(401).json("role not permitted, super admins only");
  }

  next();
}

module.exports = isAdmin;
