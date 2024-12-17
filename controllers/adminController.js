const Admin = require("../models/Admin");

const bcryptjs = require("bcryptjs");

const { validEmail } = require("../utils/validEmail");

const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const isAdmin = Boolean(
    process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password
  );

  if (isAdmin) {
    const accessToken = generateAccessToken(
      process.env.ADMIN_EMAIL,
      process.env.ACCESS_KEY
    );
    const refreshToken = generateRefreshToken(
      process.env.ADMIN_EMAIL,
      process.env.REFRESH_KEY
    );

    req.session.adminStatus = "20388";

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      message: `Admin: ${process.env.ADMIN_EMAIL} logged in successfully`,
      accessToken,
    });

    return;
  }

  if (!email || !password) {
    return res.status(403).json("Fileds must not be empty");
  }

  const foundAdmin = await Admin.findOne({ email }).lean();

  if (!foundAdmin) {
    return res.status(401).json("Invalid credentials");
  }

  const matchPassword = bcryptjs.compareSync(password, foundAdmin.password);

  if (!matchPassword) {
    return res.status(401).json("Invalid credentials");
  }

  const accessToken = generateAccessToken(
    foundAdmin.email,
    process.env.ACCESS_KEY
  );
  const refreshToken = generateRefreshToken(
    foundAdmin.email,
    process.env.REFRESH_KEY
  );

  req.session.adminStatus = foundAdmin.status;

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.status(200).json({
    message: `${foundAdmin.email} logged in successfully`,
    accessToken,
  });
};

const addAdmin = async (req, res, next) => {
  const { email, password, status } = req.body;

  if (!email || !password) {
    return res.status(403).json("Fileds must not be empty");
  }

  if (!validEmail(email)) {
    return res.status(403).json("Invalid email format");
  }

  const salt = bcryptjs.genSaltSync(10);
  const hashPassword = bcryptjs.hashSync(password, salt);

  const admin = new Admin({
    email,
    password: hashPassword,
    status,
  });

  const saveAdmin = await admin.save();

  if (!saveAdmin) {
    return res.status(500).json("Error creating Admin");
  }

  return res.status(201).json(`Admin: ${saveAdmin.email} add successfully`);
};

module.exports = { signIn, addAdmin };
