const GalleryImage = require("../models/GalleryImage");

// @route GET /api/gallery  (public)
const getGalleryImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route POST /api/gallery  (admin)
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file required" });
    const image = await GalleryImage.create({
      filename: req.file.filename,
      caption: req.body.caption || "",
    });
    res.status(201).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route DELETE /api/gallery/:id  (admin)
const deleteGalleryImage = async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });
    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getGalleryImages, uploadGalleryImage, deleteGalleryImage };
