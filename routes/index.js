const express = require("express");
const route = express.Router();

const authRoute = require("./authRoute");
const articleRoute = require("./articleRoute");
const adminRoute = require("./adminRoute");
const userRoute = require("./userRoute");
const journalistRoute = require("./journalistRoute");
const authMiddleware = require("../middlewares/authMiddlewares");
const authorizeRole = require("../middlewares/authorizeRole.js");

route.get("/", (req, res) => {
  res.status(200).send("Server is up");
});

route.use("/auth", authRoute);
route.use("/articles", articleRoute);
route.use("/user", authMiddleware, userRoute);
route.use("/admin", authMiddleware, authorizeRole("admin"), adminRoute);
route.use("/journalist", authMiddleware, authorizeRole("journalist"), journalistRoute);

module.exports = route;
