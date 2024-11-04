const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

router.get("/all", articleController.getAllArticles);
router.get("/:id", articleController.getArticleById);
router.get("/users/:userId/bookmarks", articleController.getBookmarkedArticles);
router.post("/articles/:id/bookmark", articleController.bookmarkArticle);
router.delete("/articles/:id/bookmark", articleController.unbookmarkArticle);

module.exports = router;
