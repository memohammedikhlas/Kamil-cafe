const { validationResult } = require("express-validator");

// Runs after a chain of express-validator checks; returns 400 with the first
// error if validation failed, otherwise passes through. Keeps error messages
// generic (no stack traces, no internal field details) to avoid leaking
// implementation details to an attacker.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

module.exports = { validate };
