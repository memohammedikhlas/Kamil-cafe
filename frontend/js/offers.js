document.addEventListener("DOMContentLoaded", loadOffers);

async function loadOffers() {
  const section = document.getElementById("offersSection");
  const grid = document.getElementById("offersGrid");
  if (!section || !grid) return;

  try {
    const res = await fetch(`${API_BASE_URL}/offers`);
    if (!res.ok) return;
    const offers = await res.json();

    if (!offers.length) return; // keep section hidden if no active offers

    grid.innerHTML = offers
      .map(
        (offer) => `
      <div class="offer-row">
        ${offer.badge ? `<span class="offer-badge">${escapeHtml(offer.badge)}</span>` : ""}
        <div>
          <h3>${escapeHtml(offer.title)}</h3>
          ${offer.description ? `<p>${escapeHtml(offer.description)}</p>` : ""}
          ${offer.validTill ? `<span class="offer-valid">Valid till ${escapeHtml(offer.validTill)}</span>` : ""}
        </div>
      </div>`
      )
      .join("");

    section.style.display = "block";
  } catch (err) {
    console.warn("Couldn't load offers:", err);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
