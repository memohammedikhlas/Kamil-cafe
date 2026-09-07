const express = require("express");
const router = express.Router();
const { getOffers, createOffer, updateOffer, deleteOffer } = require("../controllers/offerController");
const { protect } = require("../middleware/auth");
const { offerValidators, offerUpdateValidators } = require("../middleware/validators");
const { validate } = require("../middleware/validate");

router.get("/", getOffers); // public
router.post("/", protect, offerValidators, validate, createOffer);
router.put("/:id", protect, offerUpdateValidators, validate, updateOffer);
router.delete("/:id", protect, deleteOffer);

module.exports = router;
