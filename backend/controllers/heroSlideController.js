const HeroSlide = require("../models/HeroSlide");

// @route GET /api/hero-slides  (public - only active, ordered)
const getHeroSlides = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { active: true };
    const slides = await HeroSlide.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route POST /api/hero-slides  (admin - upload new slide image)
const createHeroSlide = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file required" });
    const count = await HeroSlide.countDocuments();
    const slide = await HeroSlide.create({
      filename: req.file.filename,
      caption: req.body.caption || "",
      order: count,
    });
    res.status(201).json(slide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/hero-slides/:id  (admin - replace image, edit caption/order/active)
const updateHeroSlide = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.filename = req.file.filename;
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    res.json(slide);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route DELETE /api/hero-slides/:id  (admin)
const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });
    res.json({ message: "Slide deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide };
