const express = require("express");
const router = express.Router();
const { login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiter");
const { loginValidators } = require("../middleware/validators");
const { validate } = require("../middleware/validate");

router.post("/login", loginLimiter, loginValidators, validate, login);
router.get("/me", protect, getMe);

module.exports = router;
