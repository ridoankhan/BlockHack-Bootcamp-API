const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");

// My custom middleware for loggin
// const logger = require('./middleware/logger');

// Load environment variables
dotenv.config({
  path: "./config/config.env",
});

// Connect Database
connectDB();
const app = express();

// Route Files
const bootcamps = require("./routes/bootcamps.js");

app.use(morgan);
// Mount Router
app.use("/api/v1/bootcamp", bootcamps);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `The server is running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow
      .bold
  );
});

// Process unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close server & exit process
  server.close(() => process.exit(1));
});
