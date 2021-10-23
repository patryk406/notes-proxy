const dotenv = require("dotenv").load();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const morgan = require("morgan");
const cors = require("cors");
const LocalStrategy = require("passport-local").Strategy;
const routes = require("./routes");
const User = require("./models/User");

const PORT = process.env.PORT || "https://notes-proxy.netlify.app/";

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use(cors());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(
  session({
    secret: "Patric",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.NODE_DATABASE, { useNewUrlParser: true });

const conn = mongoose.connection;
conn.on("error", console.error.bind(console, "connection error:"));
conn.once("open", () => {
  console.log("Connected to mongo database!");
  app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
  app.use("/api", routes);
});
