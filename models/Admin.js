const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["20388", "20148"],
      default: "20148",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 20388 -> super admin
// 20148 -> normal admin

module.exports = mongoose.model("Admin", adminSchema);
