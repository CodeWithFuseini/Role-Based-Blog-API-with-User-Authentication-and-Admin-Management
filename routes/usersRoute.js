const express = require("express");
const {
  signUp,
  signIn,
  signOut,
  verifyEmail,
} = require("../controllers/userController");

const verifyJwt = require("../middlewares/verifyJwt");
const isEmailVerified = require("../middlewares/isEmailVerified");
const rateLimiter = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", rateLimiter, signUp);
router.post("/signin", rateLimiter, isEmailVerified, signIn);
router.post("/verify-email", rateLimiter, verifyEmail);
router.post("/logout", verifyJwt, signOut);

module.exports = router;
