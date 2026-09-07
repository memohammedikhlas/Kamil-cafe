const { body } = require("express-validator");

// Every text field is explicitly type-checked with isString() BEFORE trimming -
// without this, an attacker sending an object (e.g. {"$ne": null}) instead of a
// string can slip past .trim().notEmpty() in some express-validator versions,
// since those don't themselves enforce the value is a primitive string.

// ---- Auth ----
const loginValidators = [
  body("username").isString().withMessage("Invalid username").trim().notEmpty().withMessage("Username is required").isLength({ max: 100 }),
  body("password").isString().withMessage("Invalid password").notEmpty().withMessage("Password is required").isLength({ max: 200 }),
];

// ---- Bookings ----
const bookingValidators = [
  body("name").isString().withMessage("Invalid name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("phone")
    .isString()
    .withMessage("Invalid phone number")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage("Enter a valid phone number"),
  body("email").optional({ checkFalsy: true }).isString().trim().isEmail().withMessage("Enter a valid email").normalizeEmail().isLength({ max: 150 }),
  body("date").isString().withMessage("Invalid date").trim().notEmpty().withMessage("Date is required").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Invalid date format"),
  body("time").isString().withMessage("Invalid time").trim().notEmpty().withMessage("Time is required").matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage("Invalid time format"),
  body("guests").isInt({ min: 1, max: 100 }).withMessage("Guests must be between 1 and 100"),
  body("occasion").optional().isString().trim().isIn(["family", "party", "event", "other"]).withMessage("Invalid occasion"),
  body("notes").optional({ checkFalsy: true }).isString().trim().isLength({ max: 500 }).withMessage("Notes too long"),
  body("consentGiven").custom((v) => v === true).withMessage("Please agree to the Privacy Policy"),
];

const bookingStatusValidators = [
  body("status").isString().withMessage("Invalid status").trim().isIn(["pending", "confirmed", "cancelled"]).withMessage("Invalid status"),
];

// ---- Contacts ----
const contactValidators = [
  body("name").isString().withMessage("Invalid name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("contactInfo").isString().withMessage("Invalid contact info").trim().notEmpty().withMessage("Contact info is required").isLength({ max: 150 }),
  body("message").isString().withMessage("Invalid message").trim().notEmpty().withMessage("Message is required").isLength({ max: 1000 }).withMessage("Message is too long"),
  body("consentGiven").custom((v) => v === true).withMessage("Please agree to the Privacy Policy"),
];

// ---- Menu items ----
const menuItemValidators = [
  body("name").isString().withMessage("Invalid dish name").trim().notEmpty().withMessage("Dish name is required").isLength({ max: 120 }),
  body("category").isString().withMessage("Invalid category").trim().notEmpty().withMessage("Category is required").isLength({ max: 60 }),
  body("price").isFloat({ min: 0, max: 100000 }).withMessage("Enter a valid price"),
  body("dietTag").optional().isString().trim().isIn(["veg", "jain"]).withMessage("Invalid diet tag"),
  body("available").optional().isBoolean().withMessage("Invalid availability value"),
];

const menuItemUpdateValidators = [
  body("name").optional().isString().trim().isLength({ min: 1, max: 120 }),
  body("category").optional().isString().trim().isLength({ min: 1, max: 60 }),
  body("price").optional().isFloat({ min: 0, max: 100000 }),
  body("dietTag").optional().isString().trim().isIn(["veg", "jain"]),
  body("available").optional().isBoolean(),
];

// ---- Offers ----
const offerValidators = [
  body("title").isString().withMessage("Invalid title").trim().notEmpty().withMessage("Title is required").isLength({ max: 120 }),
  body("description").optional({ checkFalsy: true }).isString().trim().isLength({ max: 400 }),
  body("badge").optional({ checkFalsy: true }).isString().trim().isLength({ max: 40 }),
  body("validTill").optional({ checkFalsy: true }).isString().trim().isLength({ max: 60 }),
  body("active").optional().isBoolean(),
];

// Used for PUT (partial updates, e.g. the admin's quick active/inactive toggle
// only sends { active }) - nothing here is required.
const offerUpdateValidators = [
  body("title").optional().isString().trim().isLength({ min: 1, max: 120 }),
  body("description").optional({ checkFalsy: true }).isString().trim().isLength({ max: 400 }),
  body("badge").optional({ checkFalsy: true }).isString().trim().isLength({ max: 40 }),
  body("validTill").optional({ checkFalsy: true }).isString().trim().isLength({ max: 60 }),
  body("active").optional().isBoolean(),
];

// ---- Hero slides ----
const heroSlideValidators = [
  body("caption").optional({ checkFalsy: true }).isString().trim().isLength({ max: 100 }),
  body("order").optional().isInt({ min: 0, max: 999 }),
  body("active").optional().isBoolean(),
];

// ---- Gallery ----
const galleryValidators = [body("caption").optional({ checkFalsy: true }).isString().trim().isLength({ max: 150 })];

// ---- Site settings ----
const settingsValidators = [
  body("cafeName").optional({ checkFalsy: true }).isString().trim().isLength({ max: 80 }),
  body("contactPhone").optional({ checkFalsy: true }).isString().trim().isLength({ max: 30 }),
  body("address").optional({ checkFalsy: true }).isString().trim().isLength({ max: 200 }),
  body("openingTime").optional({ checkFalsy: true }).isString().trim().isLength({ max: 20 }),
  body("closingTime").optional({ checkFalsy: true }).isString().trim().isLength({ max: 20 }),
  body("email").optional({ checkFalsy: true }).isString().trim().isEmail().withMessage("Enter a valid email").normalizeEmail().isLength({ max: 150 }),
  body("whatsappNumber")
    .optional({ checkFalsy: true })
    .isString()
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage("WhatsApp number should be digits only, with country code (e.g. 91XXXXXXXXXX)"),
  body("aboutTagline").optional({ checkFalsy: true }).isString().trim().isLength({ max: 300 }),
];

module.exports = {
  loginValidators,
  bookingValidators,
  bookingStatusValidators,
  contactValidators,
  menuItemValidators,
  menuItemUpdateValidators,
  offerValidators,
  offerUpdateValidators,
  heroSlideValidators,
  galleryValidators,
  settingsValidators,
};
