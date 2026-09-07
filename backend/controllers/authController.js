const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    algorithm: "HS256",
  });
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({
      _id: admin._id,
      username: admin.username,
      token: generateToken(admin._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/auth/me  (verify token still valid)
const getMe = async (req, res) => {
  res.json({ _id: req.admin._id, username: req.admin.username });
};

module.exports = { login, getMe };
