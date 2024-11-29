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

// Get a single article by ID (Only if status is "published")
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id, status: "published" });
    if (!article) {
      return res.status(404).json({ message: "Article not found or not published" });
    }
    article.views += 1;
    article.totalViews += 1;
    await article.save();
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getArticlesByTag = async (req, res) => {
  try {
    const { category } = req.query;
    const formattedCategory = category ? category.trim().toLowerCase().replace(/\s+/g, "_") : null;
    // Definisikan tag berdasarkan kategori permintaan
    const tagsMap = {
      nasional: ["hukum", "politik", "pilkada", "peristiwa"],
      internasional: ["asean", "asia pasifik", "timur tengah", "eropa amerika"],
      ekonomi: ["Keuangan Energi", "Bisnis", "Makro", "Corporate Action"],
      olahraga: ["sepak bola", "moto gp", "f1", "badminton"],
      teknologi: ["sains", "teknologi informasi", "telekomunikasi", "climate"],
      hiburan: ["film", "musik", "seleb", "seni budaya"],
      gaya_hidup: ["health", "foods", "travel", "trends"],
      otomotif: ["mobil", "motor", "info otomotif", "e-vehicle"],
    };

    const selectedTags = tagsMap[formattedCategory];

    if (!selectedTags) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Inisialisasi respons untuk semua tag
    const response = {};
    for (const tag of selectedTags) {
      response[tag] = [];
    }

    // Ambil artikel dengan status published dan berdasarkan tag yang sesuai
    const articles = await Article.find({
      tags: { $in: selectedTags },
      status: "published",
    })
      .sort({ publishedAt: -1 })
      .limit(10)
      .select("_id title content tags");

    // Format artikel sesuai tag
    articles.forEach((article) => {
      article.tags.forEach((tag) => {
        if (selectedTags.includes(tag)) {
          response[tag].push({
            _id: article._id,
            title: article.title,
            content: article.content || "",
          });
        }
      });
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller untuk mencari artikel berdasarkan query
exports.searchArticle = async (req, res) => {
  const { page = 1, limit = 10, query } = req.query;

  try {
    // Membangun query pencarian
    const searchQuery = query
      ? {
          $or: [{ title: { $regex: query, $options: "i" } }, { author: { $regex: query, $options: "i" } }, { content: { $elemMatch: { value: { $regex: query, $options: "i" } } } }, { tags: { $in: [query] } }],
        }
      : {};

    const totalArticles = await Article.countDocuments(searchQuery);

    const articles = await Article.find(searchQuery)
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
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.popularArticles = async (req, res) => {
  try {
    const popularArticles = await Article.find().sort({ views: -1, totalViews: -1 }).limit(10);

    res.status(200).json(popularArticles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
