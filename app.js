const express = require("express");
const db = require("./config/db");
const allRoutes = require("./routes");

db.then(() => {
  console.log("koneksi database berhasil");
}).catch(() => {
  console.log("koneksi database gagal");
});

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(allRoutes);

app.listen(PORT, () => {
  console.log("server running on " + PORT);
});
