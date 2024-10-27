const express = require("express");
const db = require("./config/db");
const allRoutes = require("./routes");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

db.then(() => {
  console.log("koneksi database berhasil");
}).catch(() => {
  console.log("koneksi database gagal");
});

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use(allRoutes);

app.listen(PORT, () => {
  console.log("server running on " + PORT);
});
