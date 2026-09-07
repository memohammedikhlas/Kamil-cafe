const express = require("express");
const router = express.Router();
const {
  createContact,
  getContacts,
  markContactRead,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");
const { publicWriteLimiter } = require("../middleware/rateLimiter");
const { contactValidators } = require("../middleware/validators");
const { validate } = require("../middleware/validate");

router.post("/", publicWriteLimiter, contactValidators, validate, createContact); // public
router.get("/", protect, getContacts);
router.patch("/:id/read", protect, markContactRead);
router.delete("/:id", protect, deleteContact);

module.exports = router;
