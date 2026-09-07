const Settings = require("../models/Settings");

// Only fields listed here can ever be written by updateSettings - an explicit
// whitelist rather than a blind Object.assign(req.body), so an unexpected key
// in the request body can never end up mass-assigned onto the document.
const EDITABLE_FIELDS = [
  "cafeName",
  "contactPhone",
  "address",
  "openingTime",
  "closingTime",
  "email",
  "whatsappNumber",
  "aboutTagline",
];

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

// @route GET /api/settings  (public)
const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/settings  (admin)
const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    EDITABLE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) settings[field] = req.body[field];
    });
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getSettings, updateSettings };
