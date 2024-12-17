const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const fs = require("fs");
const path = require("path");

const { connectDB } = require("./config/db");

const app = express();
const PORT = 3000;

const userRoute = require("./routes/usersRoute");
const adminRoute = require("./routes/adminsRoute");
const postRoute = require("./routes/postsRoute");

// DB connection established
connectDB();

require("dotenv").config();

app.use(express.json());

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
    maxAge: 24 * 60 * 60 * 1000, // 1 hour
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user/post", postRoute);

app.use(function (err, req, res, next) {
  if (err instanceof Error) {
    const logMessage = `[${new Date().toISOString()}]
Error: ${err.message}
Stack: ${err.stack}
Route: ${req.originalUrl}
Method: ${req.method}
------------------------------------------------
`;

    // Define the log file path
    const logFilePath = path.join(__dirname, "logs", "error.log");

    // Ensure the 'logs' directory exists
    if (!fs.existsSync(path.dirname(logFilePath))) {
      fs.mkdirSync(path.dirname(logFilePath));
    }

    // Append the error log to the file
    fs.appendFile(logFilePath, logMessage, (writeErr) => {
      if (writeErr) {
        console.error("Error writing to log file:", writeErr.message);
      }
    });

    return;
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
