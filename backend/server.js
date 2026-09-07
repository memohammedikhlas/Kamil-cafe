require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");
const connectDB = require("./config/db");
const { generalLimiter } = require("./middleware/rateLimiter");
const syncAdminFromEnv = require("./utils/syncAdminFromEnv");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const menuRoutes = require("./routes/menuRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const offerRoutes = require("./routes/offerRoutes");
const heroSlideRoutes = require("./routes/heroSlideRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// ---- Fail fast on weak/missing secrets ----
// A short or default JWT secret makes every admin login token forgeable.
// Refuse to boot rather than run insecurely.
const WEAK_SECRETS = ["change_this_to_a_long_random_secret_string", "secret", "changeme", ""];
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || WEAK_SECRETS.includes(process.env.JWT_SECRET)) {
  console.error(
    "FATAL: JWT_SECRET is missing, too short, or a known placeholder. Set a random string of 32+ characters in .env before starting the server."
  );
  process.exit(1);
}

const app = express();

// Use Node's built-in query string parser instead of the "extended" (qs-based)
// one. The qs library has had DoS/array-limit-bypass advisories; this app
// never needs qs's nested-object query syntax (every route reads flat params
// like ?date=... or ?status=...), so switching parsers removes that attack
// surface entirely rather than just patching around it.
app.set("query parser", "simple");

// Trust the first proxy hop (Render, Netlify, etc. sit in front of the app).
// Needed so express-rate-limit and req.ip see the real client IP instead of
// the proxy's IP - without this, rate limiting effectively doesn't work in production.
app.set("trust proxy", 1);

// ---- DB ----
connectDB().then(() => syncAdminFromEnv());

// ---- Security headers ----
// Strict CSP: scripts only from this same origin (no inline/eval), styles/fonts
// allowed from Google Fonts since the site loads Fraunces/Karla from there.
// Inline style attributes are allowed (style-src 'unsafe-inline') because the
// site uses them for one-off layout tweaks - inline SCRIPT is never allowed,
// which is the far more dangerous vector, so all admin pages use addEventListener
// rather than onclick="" attributes to stay compatible with this policy.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"], // blocks this API from ever being framed (clickjacking)
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

// ---- Body parsing with a strict size cap ----
// Blocks large-payload denial-of-service attempts against JSON endpoints.
app.use(express.json({ limit: "12kb" }));

// ---- Sanitization ----
// Strips any request keys starting with "$" or containing "." (e.g. {"$gt": ""}),
// which is how NoSQL/MongoDB operator-injection attacks work.
app.use(mongoSanitize());
// Prevents HTTP Parameter Pollution (duplicate query params overriding filters/logic).
app.use(hpp());

// ---- CORS ----
// Only the configured frontend and admin origins may call this API. Requests
// with no Origin header (server-to-server, curl, mobile apps) are allowed
// through since they can't be spoofed by a malicious browser page.
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5501",
  "http://127.0.0.1:5501",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
  })
);

// ---- Global rate limit (defense in depth on top of the per-route limiters) ----
app.use("/api/", generalLimiter);

// Serve uploaded images (menu photos, gallery photos, hero images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/hero-slides", heroSlideRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Kamil Cafe API is running" });
});

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---- Global error handler ----
// Never leak stack traces or internal error details to the client.
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: "Something went wrong. Please try again." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
