require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const api = require("./routes/api");

const mongoose = require("mongoose");

const mongoOptions = {
  useNewUrlParser: true,
  dbName: process.env.DATABASE_NAME
};

(async function () {
  for (let i = 0; i < 3; ++i) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, mongoOptions);
      console.log("Connected to MongoDB!");
      break;
    } catch (err) {
      console.log(err);
      await new Promise((resolve) => {
        setTimeout(() => resolve(true), mongoOptions.reconnectInterval);
      });
    }
  }
})();

var app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", api);

module.exports = app;
