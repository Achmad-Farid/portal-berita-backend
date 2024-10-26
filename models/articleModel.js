const mongoose = require("mongoose");

// Define the Article schema
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
      trim: true, 
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    tags: {
      type: [String], 
    },
    imageUrl: {
      type: String, 
    },
    publishedAt: {
      type: Date, 
      default: Date.now, 
    },
    status: {
      type: String,
      enum: ["draft", "published"], 
      default: "draft",
    },
    likes: {
      type: Number,
      default: 0, // Default likes to 0
    },
    comments: [
      {
        author: String,
        content: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Article model
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
