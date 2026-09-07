const mongoose = require("mongoose");

// Hero slideshow images - manageable from the admin dashboard instead of
// being hardcoded files, so the owner can change homepage photos anytime.
const heroSlideSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true }, // stored in /uploads
    caption: { type: String, trim: true, default: "" }, // internal label only, not shown publicly
    order: { type: Number, default: 0 }, // lower = shows first
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
