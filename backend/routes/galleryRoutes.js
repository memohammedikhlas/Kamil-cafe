const express = require("express");
const router = express.Router();
const {
  getGalleryImages,
  uploadGalleryImage,
  deleteGalleryImage,
} = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { galleryValidators } = require("../middleware/validators");
const { validate } = require("../middleware/validate");

router.get("/", getGalleryImages); // public
router.post("/", protect, upload.single("image"), galleryValidators, validate, uploadGalleryImage);
router.delete("/:id", protect, deleteGalleryImage);

module.exports = router;
