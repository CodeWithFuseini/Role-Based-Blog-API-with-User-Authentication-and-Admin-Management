const express = require("express");

const verifyJwt = require("../middlewares/verifyJwt");
const { signIn, addAdmin } = require("../controllers/adminController");
const isAdmin = require("../middlewares/isAdmin");
const rateLimiter = require("../middlewares/rateLimiter");

const router = express.Router();

router.post("/signin", rateLimiter, signIn);
router.post("/add-admin", verifyJwt, isAdmin, addAdmin);

module.exports = router;
