const Offer = require("../models/Offer");

// @route GET /api/offers  (public - only active, unless ?all=true for admin)
const getOffers = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { active: true };
    const offers = await Offer.find(filter).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route POST /api/offers  (admin)
const createOffer = async (req, res) => {
  try {
    const { title, description, badge, validTill, active } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const offer = await Offer.create({ title, description, badge, validTill, active });
    res.status(201).json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/offers/:id  (admin)
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json(offer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route DELETE /api/offers/:id  (admin)
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    res.json({ message: "Offer deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getOffers, createOffer, updateOffer, deleteOffer };
