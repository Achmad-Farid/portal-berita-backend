const express = require("express");
const route = express.Router();

const userRoute = require("./userRoute");

route.use("/users", userRoute);

module.exports = route;
