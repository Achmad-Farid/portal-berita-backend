const Article = require("../models/articleModel");

// Add a bookmark
exports.addBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id; // Ambil userId dari JWT atau session

    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (article.bookmarks.includes(userId)) {
      return res.status(400).json({ message: "You already bookmarked this article" });
    }

    article.bookmarks.push(userId);
    await article.save();

    res.status(200).json({ message: "Article bookmarked successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove a bookmark
exports.removeBookmark = async (req, res) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id; // Ambil userId dari JWT atau session

    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    if (!article.bookmarks.includes(userId)) {
      return res.status(400).json({ message: "Bookmark not found for this article" });
    }

    article.bookmarks = article.bookmarks.filter((id) => id.toString() !== userId);
    await article.save();

    res.status(200).json({ message: "Bookmark removed successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all bookmarked articles with "published" status and pagination
exports.getBookmarkedArticles = async (req, res) => {
  try {
    const userId = req.user.id; // Ambil userId dari token atau session

    // Pagination parameters
    const page = parseInt(req.query.page) || 1; // Halaman saat ini, default 1
    const limit = parseInt(req.query.limit) || 10; // Batas per halaman, default 10
    const skip = (page - 1) * limit;

    // Hitung total jumlah artikel yang cocok
    const totalArticles = await Article.countDocuments({
      bookmarks: userId,
      status: "published",
    });

    // Hitung total halaman
    const totalPages = Math.ceil(totalArticles / limit);

    // Ambil artikel berdasarkan pagination
    const articles = await Article.find({
      bookmarks: userId,
      status: "published",
    })
      .sort({ publishedAt: -1 }) // Urutkan berdasarkan tanggal publikasi terbaru
      .skip(skip)
      .limit(limit)
      .select("title author tags publishedAt status likes comments");

    res.status(200).json({
      articles,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    const username = req.user.username;

    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    const comment = { author: username, content, createdAt: new Date() };
    article.comments.push(comment);
    await article.save();

    res.status(201).json({ message: "Comment added successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { articleId, commentId } = req.params;

    // Cari artikel berdasarkan ID
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Cari komentar berdasarkan commentId
    const commentIndex = article.comments.findIndex((comment) => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Periksa apakah pengguna yang mengirim permintaan memiliki username yang sama dengan author komentar
    if (req.user.role !== "admin") {
      if (article.comments[commentIndex].author !== req.user.username) {
        return res.status(403).json({ message: "You are not authorized to delete this comment" });
      }
    }

    // Hapus komentar dari artikel
    article.comments.splice(commentIndex, 1);
    await article.save();

    res.status(200).json({ message: "Comment deleted successfully", article });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get comments
exports.getComments = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId).select("comments");
    if (!article) return res.status(404).json({ message: "Article not found" });

    res.status(200).json({ comments: article.comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
