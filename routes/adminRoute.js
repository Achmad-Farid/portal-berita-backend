const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/articles", adminController.getAllArticles);
router.get("/articles/:id", adminController.getArticleById);
router.get("/under", adminController.getUnderArticles);
router.patch("/articles/:articleId/publish", adminController.publishArticle);
router.patch("/articles/:articleId/unpublish", adminController.unPublishArticle);
router.patch("/users/:userId/role", adminController.updateUserRole);
router.delete("/articles/:id", adminController.deleteArticle);
router.get("/search", adminController.searchArticle);

router.get("/users", adminController.getAllUsers);
router.delete("/users/delete/:userId", adminController.deleteUser);
router.patch("/users/role/:userId", adminController.updateUserRole);
router.get("/users/role/:role", adminController.getUsersByRole);

module.exports = router;
