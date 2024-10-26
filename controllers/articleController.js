const Article = require("../models/articleModel");

// Get all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, author, tags, imageUrl, status } = req.body;

    const newArticle = new Article({
      title,
      content,
      author,
      tags,
      imageUrl,
      status,
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

// Update an article by ID
exports.updateArticle = async (req, res) => {
  try {
    const { title, content, author, tags, imageUrl, status } = req.body;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, author, tags, imageUrl, status },
      { new: true } // Return the updated document
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an article by ID
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
