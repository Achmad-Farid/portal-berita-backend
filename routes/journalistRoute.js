const express = require("express");
const router = express.Router();
const journalistController = require("../controllers/journalistController");

router.get("/articles", journalistController.myArticles);
router.post("/articles", journalistController.createArticle);
router.put("/articles/:id", journalistController.updateArticle);

module.exports = router;
