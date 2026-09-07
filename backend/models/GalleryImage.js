const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    caption: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryImage", galleryImageSchema);
