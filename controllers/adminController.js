const Article = require("../models/articleModel");
const User = require("../models/userModel.js");

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
