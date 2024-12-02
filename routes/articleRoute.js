const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");

router.get("/all", articleController.getAllArticles);
router.get("/tag", articleController.getArticlesByTag);
router.get("/detail/:id", articleController.getArticleById);
router.get("/search", articleController.searchArticle);
router.get("/popular", articleController.popularArticles);
router.get("/category/:categoryOrTag", articleController.getArticlesByCategoryOrTag);

module.exports = router;
