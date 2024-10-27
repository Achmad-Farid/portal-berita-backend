const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const articleController = require("../controllers/articleController.js");
const validate = require("../middlewares/validator");
const validateRequest = require("../middlewares/validateRequest");

// router login dan regis
router.post("/signup", validate.validateSignup, validateRequest, userController.signup);
router.post("/login", validate.validateLogin, validateRequest, userController.login);
router.get("/google", userController.loginWithGoogle);
router.get("/google/callback", userController.googleCallback, userController.redirectAfterLogin);
router.get("/logout", userController.logout);
router.get("/articles", articleController.getAllArticles);

module.exports = router;
