const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users/:userId/bookmarks", userController.getBookmarkedArticles);
router.post("/articles/:id/bookmark", userController.bookmarkArticle);
router.delete("/articles/:id/bookmark", userController.unbookmarkArticle);

module.exports = router;
