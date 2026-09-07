// Fetches site-wide settings (cafe name, contact info, hours, WhatsApp number,
// tagline) and populates every element tagged with data-settings="<field>" or
// data-settings-hours on the page. Falls back to whatever static text is
// already in the HTML if a field is empty or the request fails, so the site
// never shows a blank space just because Settings hasn't been filled in yet.
document.addEventListener("DOMContentLoaded", loadSettings);

const WHATSAPP_FALLBACK_NUMBER = "919999999999"; // used only if Settings has no WhatsApp number set
const WHATSAPP_MESSAGE = "Hi Kamil Cafe! I'd like to know more.";

async function loadSettings() {
  let settings = null;
  try {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (res.ok) settings = await res.json();
  } catch (err) {
    console.warn("Couldn't load site settings:", err);
  }

  if (settings) {
    document.querySelectorAll("[data-settings]").forEach((el) => {
      const field = el.dataset.settings;
      if (settings[field]) el.textContent = settings[field];
    });

    if (settings.openingTime && settings.closingTime) {
      const hoursText = `${settings.openingTime} \u2013 ${settings.closingTime}`;
      document.querySelectorAll("[data-settings-hours]").forEach((el) => {
        el.textContent = hoursText;
      });
    }
  }

  injectWhatsappButton(settings && settings.whatsappNumber);
}

function injectWhatsappButton(number) {
  if (document.querySelector(".whatsapp-float")) return;
  const waNumber = number || WHATSAPP_FALLBACK_NUMBER;

  const link = document.createElement("a");
  link.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "whatsapp-float";
  link.setAttribute("aria-label", "Chat with us on WhatsApp");
  link.title = "Chat with us on WhatsApp";
  link.innerHTML = `
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.386.697 4.607 1.897 6.471L4 29l7.727-2.02A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
      <path d="M12.5 10.5c-.3-.7-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.9 5.9 3.4 1.3 4.1 1 4.8.9.7-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5-.4-.2-2.3-1.1-2.6-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.5-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2.1-.5 0-.7-.1-.2-.9-2.2-1.2-3.1z" fill="#25D366"/>
    </svg>
  `;
  document.body.appendChild(link);
}
