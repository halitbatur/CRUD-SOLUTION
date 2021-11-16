const mongoose = require("mongoose");

const blogAuthor = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true,
    enum: ["Turkish", "Iraqi", "Syrian"]
  },
  areasOfExpertise: {
    type: [String],
    default: []
  }
});

const blogPost = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 120,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: []
    },
    likes: {
      type: Number,
      default: 0
    },
    author: blogAuthor,
  },
  { timestamps: true }
);

module.exports = mongoose.model("blogpost", blogPost);
