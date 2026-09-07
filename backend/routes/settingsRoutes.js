const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { protect } = require("../middleware/auth");
const { settingsValidators } = require("../middleware/validators");
const { validate } = require("../middleware/validate");

router.get("/", getSettings); // public
router.put("/", protect, settingsValidators, validate, updateSettings);

module.exports = router;
