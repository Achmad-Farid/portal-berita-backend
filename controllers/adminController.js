const Article = require("../models/articleModel");
const User = require("../models/userModel.js");

// Controller untuk mendapatkan semua artikel
exports.getAllArticles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const totalArticles = await Article.countDocuments();

    const articles = await Article.find()
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

// Controller untuk mendapatkan semua under review artikel
exports.getUnderArticles = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const totalPublishedArticles = await Article.countDocuments({ status: "under review" });

    const articles = await Article.find({ status: "under review" })
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

// Publish article (Admin only)
exports.publishArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    // Pastikan user adalah admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const article = await Article.findByIdAndUpdate(
      articleId,
      { status: "published", publishedAt: new Date() }, // Set status to published
      { new: true }
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

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Pastikan user yang melakukan permintaan adalah admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Validasi role yang diberikan
    if (!["admin", "user", "journalist"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    // Temukan pengguna dan perbarui role-nya
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User role updated successfully.", updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fungsi untuk mendapatkan semua pengguna dengan pagination
exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Ambil parameter page dan limit dari query string

  try {
    // Hitung total pengguna
    const totalUsers = await User.countDocuments();

    // Ambil pengguna berdasarkan halaman dan limit
    const users = await User.find()
      .limit(parseInt(limit)) // Batasi jumlah hasil sesuai dengan limit
      .skip((page - 1) * limit) // Lewati sejumlah hasil berdasarkan halaman
      .exec();

    // Hitung total halaman
    const totalPages = Math.ceil(totalUsers / limit);

    // Kirimkan respons dengan data pengguna dan informasi pagination
    res.status(200).json({
      users,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message }); // Kirimkan error jika terjadi kesalahan
  }
};

/// Fungsi untuk mendapatkan pengguna berdasarkan role dengan pagination
exports.getUsersByRole = async (req, res) => {
  const { role } = req.params; // Ambil role dari parameter
  const { page = 1, limit = 10 } = req.query; // Ambil page dan limit dari query string

  try {
    // Hitung total pengguna dengan role tertentu
    const totalUsers = await User.countDocuments({ role });

    // Cari pengguna dengan role tertentu berdasarkan halaman dan limit
    const users = await User.find({ role })
      .limit(parseInt(limit)) // Batasi jumlah hasil sesuai dengan limit
      .skip((page - 1) * limit) // Lewati sejumlah hasil berdasarkan halaman
      .exec();

    // Hitung total halaman
    const totalPages = Math.ceil(totalUsers / limit);

    if (users.length === 0) {
      return res.status(404).json({ message: `No users found with role: ${role}` });
    }

    // Kirimkan respons dengan data pengguna dan informasi pagination
    res.status(200).json({
      users,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message }); // Kirimkan error jika terjadi kesalahan
  }
};
