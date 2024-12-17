const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  verifiedEmail: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
