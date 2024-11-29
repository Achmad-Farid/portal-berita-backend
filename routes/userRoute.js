const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Bookmark routes
router.post("/:articleId/bookmark", userController.addBookmark);
router.delete("/:articleId/bookmark", userController.removeBookmark);
router.get("/article", userController.getBookmarkedArticles);

// Comment routes
router.get("/:articleId/comments", userController.getComments);
router.post("/:articleId/comments", userController.addComment);
router.delete("/:articleId/comments/:commentId", userController.deleteComment);
module.exports = router;
