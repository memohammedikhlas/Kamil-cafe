document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const msg = document.getElementById("formMsg");
  const submitBtn = document.getElementById("submitBtn");

  // Prevent booking a date in the past
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form-msg";
    msg.style.display = "none";

    const payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      date: form.date.value,
      time: form.time.value,
      guests: Number(form.guests.value),
      occasion: form.occasion.value,
      notes: form.notes.value.trim(),
      consentGiven: form.consent.checked,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      msg.className = "form-msg success";
      msg.textContent = "Booking received! We'll confirm shortly" + (payload.email ? " by email." : ".");
      msg.style.display = "block";
      form.reset();
    } catch (err) {
      msg.className = "form-msg error";
      msg.textContent = err.message || "Couldn't submit booking. Please try again or call us directly.";
      msg.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Request Booking";
      window.scrollTo({ top: form.offsetTop - 120, behavior: "smooth" });
    }
  });
});
