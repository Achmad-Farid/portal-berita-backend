const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/articles", adminController.getAllArticles);
router.get("/articles/under", adminController.getUnderArticles);
router.patch("/articles/:articleId/publish", adminController.publishArticle);
router.patch("/users/:userId/role", adminController.updateUserRole);
router.delete("/articles/:id", adminController.deleteArticle);

router.get("/users", adminController.getAllUsers);
router.get("/users/role/:role", adminController.getUsersByRole);

module.exports = router;
