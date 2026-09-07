const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // e.g. "Weekday Lunch Thali Special"
    description: { type: String, trim: true, default: "" }, // e.g. "Flat 15% off, Mon-Fri 12:30-3PM"
    badge: { type: String, trim: true, default: "" }, // short highlight text e.g. "20% OFF", "New"
    validTill: { type: String, trim: true, default: "" }, // free text or date string, optional
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
