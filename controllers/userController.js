const User = require("../models/User");
const { validEmail } = require("../utils/validEmail");
const bcryptjs = require("bcryptjs");

const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

const signUp = async (req, res) => {
  const { name, firstName, email, country, password } = req.body;

  if (!name || !firstName || !email || !country || !password) {
    return res.status(403).json("Fileds must not be empty");
  }

  if (!validEmail(email)) {
    return res.status(403).json("Invalid email format");
  }

  const salt = bcryptjs.genSaltSync(10);
  const hashPassword = bcryptjs.hashSync(password, salt);

  const user = new User({
    name,
    firstName,
    email,
    country,
    password: hashPassword,
  });

  const saveUser = await user.save();

  if (!saveUser) {
    return res.status(500).json("Error creating user");
  }

  return res.status(201).json("User regitered successfully");
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json("Fileds must not be empty");
    }

    const foundUser = await User.findOne({ email }).lean().exec();

    if (!foundUser) {
      return res.status(401).json("Invalid Credentials");
    }

    const matchPassword = bcryptjs.compareSync(password, foundUser.password);

    if (!matchPassword) {
      return res.status(404).json("Invalid credentials");
    }

    const accessToken = generateAccessToken(
      foundUser.email,
      process.env.ACCESS_KEY
    );

    const refreshToken = generateRefreshToken(
      foundUser.email,
      process.env.REFRESH_KEY
    );

    req.session.userId = foundUser._id;

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({
      message: `${foundUser.email} logged in successfully`,
      accessToken,
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const verifyEmail = async (req, res) => {
  const { email } = req.body;

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(404).json("Invalid email address");
  }

  foundUser.verifiedEmail = true;

  const verify = await foundUser.save();

  if (!verify) {
    return res.status(500).json("Failed to verify email address");
  }

  return res.status(200).json("Email verified successfully");
};

const signOut = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204).json("No Content");

  req.session.destroy(function (err) {
    if (err) console.log(err);
    else console.log("Logged Out Successfully");
  });

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    maxAge: 24 * (60 * 60 * 1000),
    sameSite: "none",
  });

  res.json({ msg: "Logged Out Successfully" });

  return;
};

module.exports = { signUp, signIn, signOut, verifyEmail };
