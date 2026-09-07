document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const msg = document.getElementById("contactMsg");
  const submitBtn = document.getElementById("contactSubmitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form-msg";
    msg.style.display = "none";

    const payload = {
      name: form.name.value.trim(),
      contactInfo: form.contactInfo.value.trim(),
      message: form.message.value.trim(),
      consentGiven: form.consent.checked,
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      msg.className = "form-msg success";
      msg.textContent = "Message sent! We'll get back to you soon.";
      msg.style.display = "block";
      form.reset();
    } catch (err) {
      msg.className = "form-msg error";
      msg.textContent = err.message || "Couldn't send message. Please try again.";
      msg.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
});
