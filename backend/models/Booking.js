const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true }, // optional, needed for email confirmation
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:MM
    guests: { type: Number, required: true, min: 1 },
    occasion: {
      type: String,
      enum: ["family", "party", "event", "other"],
      default: "family",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: { type: String, trim: true },
    // DPDP Act 2023 compliance: records that the person gave clear affirmative
    // consent to their data being processed for this booking (Section 6).
    consentGiven: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
