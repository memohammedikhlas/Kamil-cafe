const MenuItem = require("../models/MenuItem");

// @route GET /api/menu  (public - only available items, unless ?all=true for admin)
const getMenuItems = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { available: true };
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route POST /api/menu  (admin)
const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, dietTag, available } = req.body;
    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: "Name, category, and price are required" });
    }
    const image = req.file ? req.file.filename : "";
    const item = await MenuItem.create({ name, category, price, dietTag, available, image });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/menu/:id  (admin)
const updateMenuItem = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.filename;

    const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route DELETE /api/menu/:id  (admin)
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };
