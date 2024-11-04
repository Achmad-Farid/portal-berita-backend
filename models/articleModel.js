const mongoose = require("mongoose");

// Define the Article schema
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: [
      {
        type: {
          type: String,
          enum: ["text", "image", "subtitle"],
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        position: {
          type: Number,
          required: true,
        },
      },
    ],
    author: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
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
      default: 0,
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
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Article", articleSchema);
