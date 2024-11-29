const Article = require("../models/articleModel");

exports.myArticles = async (req, res) => {
  try {
    // Parsing nilai halaman dan limit dari query parameter
    const { page = 1, limit = 10 } = req.query;

    // Mendapatkan username dari pengguna yang sedang login
    const authorUsername = req.user.username;

    // Mendapatkan total jumlah artikel yang dipublikasikan oleh pengguna
    const totalArticles = await Article.countDocuments({
      author: authorUsername,
    });

    // Menemukan artikel yang dipublikasikan oleh pengguna dengan pagination
    const articles = await Article.find({
      author: authorUsername,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * parseInt(limit))
      .exec();

    // Menghitung total halaman
    const totalPages = Math.ceil(totalArticles / limit);

    // Mengembalikan hasil dalam format JSON
    res.status(200).json({
      articles,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    // Mengirimkan error jika terjadi kesalahan
    res.status(500).json({ message: err.message });
  }
};

// Controller untuk mencari artikel berdasarkan query dengan filter author
exports.searchArticle = async (req, res) => {
  const { page = 1, limit = 10, query } = req.query;

  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Membangun query pencarian
    const searchQuery = {
      $and: [
        { author: req.user.username }, // Filter berdasarkan author
        query
          ? {
              $or: [{ title: { $regex: query, $options: "i" } }, { content: { $elemMatch: { value: { $regex: query, $options: "i" } } } }, { tags: { $in: [query] } }],
            }
          : {},
      ],
    };

    // Hitung total artikel sesuai filter
    const totalArticles = await Article.countDocuments(searchQuery);

    // Ambil artikel sesuai filter dengan pagination
    const articles = await Article.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .exec();

    const totalPages = Math.ceil(totalArticles / limit);

    // Respons hasil pencarian
    res.status(200).json({
      articles,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUnderArticles = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Menentukan status artikel yang ingin dicari, jika tidak ada query status, default "under review"
    const statusFilter = status && (status === "under review" || status === "published") ? status : "under review";

    // Hitung total artikel dengan status yang dipilih dan author yang sesuai
    const totalArticles = await Article.countDocuments({
      status: statusFilter,
      author: req.user.username,
    });

    // Ambil artikel dengan status yang dipilih dan author yang sesuai dengan pagination
    const articles = await Article.find({
      status: statusFilter,
      author: req.user.username,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .exec();

    const totalPages = Math.ceil(totalArticles / limit);

    res.status(200).json({
      articles,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single article by ID (Status "published" or "under review" if username matches author)
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.user;

    const article = await Article.findOne({
      _id: id,
      $or: [{ status: "published" }, { status: "under review", author: username }],
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found or access denied" });
    }

    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

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
