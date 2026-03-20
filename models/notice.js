const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
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
  iconClass: {
    type: String,
    trim: true,
    default: "bi bi-megaphone text-primary"
  }
}, { timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);
