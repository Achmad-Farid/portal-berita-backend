const express = require("express");
const router = express.Router();
const journalistController = require("../controllers/journalistController");

router.get("/articles", journalistController.myArticles);
router.get("/search", journalistController.searchArticle);
router.get("/status", journalistController.getUnderArticles);
router.get("/articles/:id", journalistController.getArticleById);
router.post("/articles", journalistController.createArticle);
router.put("/articles/:id", journalistController.updateArticle);

module.exports = router;
