const express = require("express");
const router = express.Router();
const {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} = require("../controllers/heroSlideController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { heroSlideValidators } = require("../middleware/validators");
const { validate } = require("../middleware/validate");

router.get("/", getHeroSlides); // public
router.post("/", protect, upload.single("image"), heroSlideValidators, validate, createHeroSlide);
router.put("/:id", protect, upload.single("image"), heroSlideValidators, validate, updateHeroSlide);
router.delete("/:id", protect, deleteHeroSlide);

module.exports = router;
