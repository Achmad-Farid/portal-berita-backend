const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController.js");
const validate = require("../middlewares/validator.js");
const validateRequest = require("../middlewares/validateRequest.js");

// router login dan regis
router.post("/signup", validate.validateSignup, validateRequest, authController.signup);
router.post("/login", validate.validateLogin, validateRequest, authController.login);
router.get("/google", authController.loginWithGoogle);
router.get("/google/callback", authController.googleCallback);

module.exports = router;
