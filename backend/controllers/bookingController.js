const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");

// ---- Email templates ----
function confirmedEmailHtml(booking) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
      <h2 style="color:#8C6B2F;">Booking Confirmed!</h2>
      <p>Hi ${booking.name},</p>
      <p>Your table booking at <strong>Kamil Cafe</strong> is confirmed:</p>
      <ul>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
        <li><strong>Guests:</strong> ${booking.guests}</li>
        <li><strong>Occasion:</strong> ${booking.occasion}</li>
      </ul>
      <p>We look forward to hosting you. See you soon!</p>
      <p style="color:#ABA391;font-size:13px;">Kamil Cafe</p>
    </div>
  `;
}

function cancelledEmailHtml(booking) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;">
      <h2 style="color:#B3261E;">Booking Cancelled</h2>
      <p>Hi ${booking.name},</p>
      <p>Your table booking at <strong>Kamil Cafe</strong> for the details below has been cancelled:</p>
      <ul>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
        <li><strong>Guests:</strong> ${booking.guests}</li>
      </ul>
      <p>If this wasn't expected, or you'd like to book another slot, feel free to reach out to us or visit the website again.</p>
      <p style="color:#ABA391;font-size:13px;">Kamil Cafe</p>
    </div>
  `;
}

// @route POST /api/bookings   (public - customer submits)
const createBooking = async (req, res) => {
  try {
    const { name, phone, email, date, time, guests, occasion, notes, consentGiven } = req.body;
    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    if (!consentGiven) {
      return res.status(400).json({ message: "Please agree to the Privacy Policy to submit a booking" });
    }

    const booking = await Booking.create({ name, phone, email, date, time, guests, occasion, notes, consentGiven });
    res.status(201).json({ message: "Booking received! We'll confirm shortly.", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/bookings   (admin - list all, optional ?date=YYYY-MM-DD filter)
const getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) filter.date = req.query.date;
    if (req.query.status) filter.status = req.query.status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PATCH /api/bookings/:id   (admin - confirm or cancel)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Send an automatic email whenever a booking is confirmed OR cancelled (if an email is on file)
    if ((status === "confirmed" || status === "cancelled") && booking.email) {
      try {
        await sendEmail({
          to: booking.email,
          subject:
            status === "confirmed"
              ? "Your table is confirmed - Kamil Cafe"
              : "Your booking has been cancelled - Kamil Cafe",
          html: status === "confirmed" ? confirmedEmailHtml(booking) : cancelledEmailHtml(booking),
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr.message);
        // Don't fail the request if email fails - booking status is already updated
      }
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route DELETE /api/bookings/:id  (admin)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route GET /api/bookings/stats  (admin overview)
const getBookingStats = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const todayCount = await Booking.countDocuments({ date: today });
    const weekCount = await Booking.countDocuments({ date: { $gte: weekAgo } });
    const pendingCount = await Booking.countDocuments({ status: "pending" });

    res.json({ today: todayCount, thisWeek: weekCount, pending: pendingCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus, deleteBooking, getBookingStats };
