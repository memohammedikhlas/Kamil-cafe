const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true }, // phone or email
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
    // DPDP Act 2023 compliance: records that the person gave clear affirmative
    // consent to their data being processed for this enquiry (Section 6).
    consentGiven: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
