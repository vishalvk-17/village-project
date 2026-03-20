const mongoose = require("mongoose");

const starSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true,
    default: "https://placehold.co/600x400?text=Village+Star"
  },
  accentClass: {
    type: String,
    trim: true,
    default: "text-primary"
  }
}, { timestamps: true });

module.exports = mongoose.model("Star", starSchema);
