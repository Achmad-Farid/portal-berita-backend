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

// Mendapatkan semua artikel yang di-bookmark oleh pengguna
exports.getBookmarkedArticles = async (req, res) => {
  try {
    const { userId } = req.params; // Ambil userId dari parameter route
    const bookmarkedArticles = await Article.find({ bookmarks: userId }).populate("bookmarks"); // Mengambil artikel berdasarkan userId di bookmarks

    res.status(200).json(bookmarkedArticles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Menandai artikel
exports.bookmarkArticle = async (req, res) => {
  try {
    const { userId } = req.body; // Pastikan userId dikirim dalam body permintaan
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Periksa apakah userId sudah ada di dalam bookmarks
    if (!article.bookmarks.includes(userId)) {
      article.bookmarks.push(userId); // Tambahkan userId ke bookmarks
      await article.save();
      return res.status(200).json({ message: "Article bookmarked successfully" });
    } else {
      return res.status(400).json({ message: "Article already bookmarked" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Menghapus penandaan artikel
exports.unbookmarkArticle = async (req, res) => {
  try {
    const { userId } = req.body; // Pastikan userId dikirim dalam body permintaan
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Hapus userId dari bookmarks jika ada
    article.bookmarks = article.bookmarks.filter((id) => id.toString() !== userId);
    await article.save();

    res.status(200).json({ message: "Article unbookmarked successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
