const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const isAuthenticated = require("../middlewares/authMiddlewares.js");

router.patch("/articles/:articleId/publish", isAuthenticated, adminController.publishArticle);
router.patch("/users/:userId/role", isAuthenticated, adminController.updateUserRole);
router.delete("/articles/:id", isAuthenticated, adminController.deleteArticle);

module.exports = router;
