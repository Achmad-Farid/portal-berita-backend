const express = require("express");
const db = require("./config/db");
const allRoutes = require("./routes");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("./config/passport");

db.then(() => {
  console.log("Koneksi database berhasil");
}).catch(() => {
  console.log("Koneksi database gagal");
});

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://portal-berita-wh1t.vercel.app"],
    credentials: true,
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "sessions",
    }),
    cookie: {
      secure: false, // Ubah ke true jika menggunakan HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware untuk JSON dan URL encoded
app.use(express.json());
app.use(allRoutes);

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
