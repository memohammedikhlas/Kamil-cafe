const mongoose = require("mongoose");

// Site-wide settings - a SINGLE document (singleton). There is only ever one
// settings record; getOrCreateSettings() in the controller enforces this by
// always fetching (or creating) the first and only document.
const settingsSchema = new mongoose.Schema(
  {
    cafeName: { type: String, trim: true, default: "Kamil Cafe" },
    contactPhone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    openingTime: { type: String, trim: true, default: "8:00 AM" },
    closingTime: { type: String, trim: true, default: "11:00 PM" },
    email: { type: String, trim: true, default: "" },
    whatsappNumber: { type: String, trim: true, default: "" }, // digits only, country code first
    aboutTagline: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
