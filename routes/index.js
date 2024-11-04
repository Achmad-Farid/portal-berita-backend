const express = require("express");
const route = express.Router();

const userRoute = require("./authRoute");
const articleRoute = require("./articleRoute");
const adminRoute = require("./adminRoute");

route.get("/", (req, res) => {
  res.status(200).send("Server is up");
});

route.use("/auth", userRoute);
route.use("/articles", articleRoute);
route.use("/admin", adminRoute);

module.exports = route;
