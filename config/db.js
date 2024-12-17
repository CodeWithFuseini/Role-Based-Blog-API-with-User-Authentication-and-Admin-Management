const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = async function () {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    if (!connection) throw new Error("Can't connect to MongoDB");
    console.log("MongoDB connected successfully");
  } catch (err) {
    if (err instanceof Error) throw new Error("Can't connect to MongoDB");
  }
};

module.exports = { connectDB };
