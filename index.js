const express = require("express");
const db = require("./config/db");
const allRoutes = require("./routes");
const cors = require("cors");
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
    origin: ["http://localhost:5173", "http://portal-berita-wh1t.vercel.app", "https://portal-berita-wh1t.vercel.app"],
    credentials: true,
  })
);

// Middleware untuk JSON dan URL encoded
app.use(express.json());

// Passport middleware
app.use(passport.initialize());

// Routes
app.use(allRoutes);

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
