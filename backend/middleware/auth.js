const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Protects admin routes - requires a valid JWT in the Authorization header
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // Explicitly pin the algorithm - never trust an "alg" the token itself claims.
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin) {
        return res.status(401).json({ message: "Not authorized, admin not found" });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
