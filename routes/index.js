const express = require("express");
const route = express.Router();

const userRoute = require("./authRoute");

route.use("/auth", userRoute);

module.exports = route;
