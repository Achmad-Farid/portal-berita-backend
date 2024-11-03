const express = require("express");
const route = express.Router();

const userRoute = require("./authRoute");

route.get("/", (req, res) => {
  res.status(200).send("Server is up and running!");
});

route.use("/auth", userRoute);

module.exports = route;
