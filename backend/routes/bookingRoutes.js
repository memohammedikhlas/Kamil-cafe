const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getBookingStats,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");
const { publicWriteLimiter } = require("../middleware/rateLimiter");
const { bookingValidators, bookingStatusValidators } = require("../middleware/validators");
const { validate } = require("../middleware/validate");

router.post("/", publicWriteLimiter, bookingValidators, validate, createBooking); // public
router.get("/stats", protect, getBookingStats);
router.get("/", protect, getBookings);
router.patch("/:id", protect, bookingStatusValidators, validate, updateBookingStatus);
router.delete("/:id", protect, deleteBooking);

module.exports = router;
