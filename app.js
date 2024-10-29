const express = require("express");
const db = require("./config/db");
const allRoutes = require("./routes");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
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
