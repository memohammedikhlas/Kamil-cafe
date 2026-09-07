const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Free text (not a fixed enum) so admin can create new categories from the dashboard
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    dietTag: { type: String, enum: ["veg", "jain"], default: "veg" },
    image: { type: String, default: "" }, // filename in /assets/images
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
