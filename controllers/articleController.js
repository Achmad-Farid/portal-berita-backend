const Article = require("../models/articleModel");

// Controller untuk mendapatkan semua artikel
exports.getAllArticles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const totalPublishedArticles = await Article.countDocuments({ status: "published" });

    const articles = await Article.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .exec();

    const totalPages = Math.ceil(totalPublishedArticles / limit);

    res.status(200).json({
      articles,
      totalPages,
      currentPage: parseInt(page),
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
