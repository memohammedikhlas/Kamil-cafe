const express = require("express");
const router = express.Router();
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { menuItemValidators, menuItemUpdateValidators } = require("../middleware/validators");
const { validate } = require("../middleware/validate");

router.get("/", getMenuItems); // public
router.post("/", protect, upload.single("image"), menuItemValidators, validate, createMenuItem);
router.put("/:id", protect, upload.single("image"), menuItemUpdateValidators, validate, updateMenuItem);
router.delete("/:id", protect, deleteMenuItem);

module.exports = router;
