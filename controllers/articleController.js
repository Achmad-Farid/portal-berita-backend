const Article = require("../models/articleModel");

// Controller untuk mendapatkan semua artikel
exports.getAllArticles = async (req, res) => {
  // Menyediakan default value untuk page dan limit jika tidak disertakan
  const { page = 1, limit = 10 } = req.query;

  try {
    // Menghitung total artikel yang sudah dipublikasikan
    const totalPublishedArticles = await Article.countDocuments({ status: "published" });

    // Mengambil artikel berdasarkan status "published", dengan limit dan skip untuk pagination
    const articles = await Article.find({ status: "published" })
      .sort({ createdAt: -1 }) // Mengurutkan berdasarkan tanggal pembuatan
      .limit(parseInt(limit)) // Membatasi jumlah artikel per halaman
      .skip((page - 1) * limit) // Menentukan jumlah artikel yang dilewati berdasarkan halaman
      .exec();

    // Menghitung jumlah total halaman berdasarkan jumlah artikel dan limit
    const totalPages = Math.ceil(totalPublishedArticles / limit);

    // Mengembalikan respons dalam format JSON
    res.status(200).json({
      articles,
      totalPages,
      currentPage: parseInt(page), // Halaman yang sedang aktif
    });
  } catch (err) {
    // Menangani error jika terjadi kesalahan dalam proses
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
