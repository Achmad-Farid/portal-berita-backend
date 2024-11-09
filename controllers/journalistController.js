const Article = require("../models/articleModel");

exports.myArticles = async (req, res) => {
  try {
    // Parsing nilai halaman dan limit dari query parameter
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    // Mendapatkan username dari pengguna yang sedang login
    const authorUsername = req.user.username;

    // Mendapatkan total jumlah artikel yang dipublikasikan dan sesuai dengan author
    const totalPublishedArticles = await Article.countDocuments({
      status: "published",
      author: authorUsername,
    });

    // Menemukan artikel yang dipublikasikan dan sesuai author dengan pagination
    const articles = await Article.find({
      author: authorUsername,
    })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Mengembalikan hasil dalam format JSON
    res.status(200).json({
      total: totalPublishedArticles,
      page: page,
      pages: Math.ceil(totalPublishedArticles / limit),
      articles: articles,
    });
  } catch (err) {
    // Mengirimkan error jika terjadi kesalahan
    res.status(500).json({ message: err.message });
  }
};

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    console.log(req.user);
    const author = req.user.username;

    const newArticle = new Article({
      title,
      content,
      author,
      tags,
      status: "under review",
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update an article by ID
exports.updateArticle = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    const article = await Article.findByIdAndUpdate(req.params.id, { title, content, author, tags, status: "under review" }, { new: true });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
