const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController.js");
const validate = require("../middlewares/validator");
const validateRequest = require("../middlewares/validateRequest");

// router login dan regis
router.post("/signup", validate.validateSignup, validateRequest, UserController.signup);
router.post("/login", validate.validateLogin, validateRequest, UserController.login);
router.get("/verify/:token", UserController.verify);

module.exports = router;
