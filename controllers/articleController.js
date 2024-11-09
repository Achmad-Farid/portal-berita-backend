const Article = require("../models/articleModel");

exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const startIndex = (page - 1) * limit;

    const totalPublishedArticles = await Article.countDocuments({ status: "published" });

    const articles = await Article.find({ status: "published" }).sort({ createdAt: -1 }).skip(startIndex).limit(limit);

    res.status(200).json({
      total: totalPublishedArticles,
      page,
      pages: Math.ceil(totalPublishedArticles / limit),
      articles,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
