const Contact = require("../models/Contact");

// @route POST /api/contacts  (public - contact form submit)
const createContact = async (req, res) => {
  try {
    const { name, contactInfo, message, consentGiven } = req.body;
    if (!name || !contactInfo || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!consentGiven) {
      return res.status(400).json({ message: "Please agree to the Privacy Policy to send a message" });
    }
    const contact = await Contact.create({ name, contactInfo, message, consentGiven });
    res.status(201).json({ message: "Message sent! We'll get back to you soon.", contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/contacts  (admin - list all)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PATCH /api/contacts/:id/read  (admin - mark as read)
const markContactRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route DELETE /api/contacts/:id  (admin)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createContact, getContacts, markContactRead, deleteContact };
