requireAuth();

const form = document.getElementById("settingsForm");
const msg = document.getElementById("settingsMsg");
const saveBtn = document.getElementById("saveBtn");

const FIELDS = ["cafeName", "contactPhone", "address", "openingTime", "closingTime", "email", "whatsappNumber", "aboutTagline"];

async function loadSettings() {
  try {
    const res = await authFetch(`${API_BASE_URL}/settings`);
    const settings = await res.json();
    FIELDS.forEach((field) => {
      const el = document.getElementById(field);
      if (el && settings[field] !== undefined) el.value = settings[field];
    });
  } catch (err) {
    console.error(err);
    msg.className = "form-msg error";
    msg.textContent = "Couldn't load current settings.";
    msg.style.display = "block";
  }
}

document.getElementById("cancelBtn").addEventListener("click", loadSettings);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.style.display = "none";

  const payload = {};
  FIELDS.forEach((field) => {
    payload[field] = document.getElementById(field).value.trim();
  });

  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  try {
    const res = await authFetch(`${API_BASE_URL}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to save settings");
    }
    msg.className = "form-msg success";
    msg.textContent = "Settings saved.";
    msg.style.display = "block";
  } catch (err) {
    msg.className = "form-msg error";
    msg.textContent = err.message;
    msg.style.display = "block";
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Changes";
  }
});

loadSettings();
