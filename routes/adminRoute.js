const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/articles", adminController.createArticle);
router.put("/articles/:id", adminController.updateArticle);
router.delete("/articles/:id", adminController.deleteArticle);

module.exports = router;
