const rateLimit = require("express-rate-limit");

// Login: max 5 attempts per 15 minutes per IP.
// Blocks brute-force password guessing without affecting normal usage.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again in 15 minutes." },
  skipSuccessfulRequests: true, // only counts failed attempts against the limit
});

// Public write endpoints (bookings, contact form) - prevents spam/abuse.
const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

// Blanket limiter applied to every /api/ request as defense-in-depth against
// scraping and volumetric abuse, on top of the tighter per-route limiters above.
// Generous enough that normal browsing (menu/gallery/offers loading) never hits it.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this device. Please slow down and try again shortly." },
});

module.exports = { loginLimiter, publicWriteLimiter, generalLimiter };
