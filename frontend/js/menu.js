document.addEventListener("DOMContentLoaded", loadMenu);

async function loadMenu() {
  const loading = document.getElementById("menuLoading");
  const errorBox = document.getElementById("menuError");
  const container = document.getElementById("menuContainer");
  const tabsWrap = document.getElementById("menuTabs");

  try {
    const res = await fetch(`${API_BASE_URL}/menu`);
    if (!res.ok) throw new Error("Failed to load menu");
    const items = await res.json();

    loading.style.display = "none";

    if (!items.length) {
      container.innerHTML = `<p style="text-align:center; padding:40px 0;">Menu coming soon — please check back shortly.</p>`;
      return;
    }

    // Group by category, preserving first-seen order
    const categories = [];
    const grouped = {};
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
        categories.push(item.category);
      }
      grouped[item.category].push(item);
    });

    // Build tabs
    tabsWrap.innerHTML =
      `<button class="menu-tab active" data-cat="all">All</button>` +
      categories.map((c) => `<button class="menu-tab" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("");

    // Build sections
    container.innerHTML = categories
      .map(
        (cat) => `
        <div class="menu-category" data-cat="${escapeHtml(cat)}">
          <h3 class="menu-category-title">${escapeHtml(cat)}</h3>
          <div class="menu-list">
            ${grouped[cat]
              .map(
                (item) => `
                <div class="menu-item">
                  <div class="menu-item-left">
                    <span class="diet-badge"></span>
                    <span class="menu-item-name">${escapeHtml(item.name)}</span>
                    ${item.dietTag === "jain" ? '<span class="jain-pill">Jain</span>' : ""}
                  </div>
                  <span class="menu-item-price">&#8377;${item.price}</span>
                </div>`
              )
              .join("")}
          </div>
        </div>`
      )
      .join("");

    // Tab filtering
    tabsWrap.querySelectorAll(".menu-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        tabsWrap.querySelectorAll(".menu-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const cat = tab.dataset.cat;
        container.querySelectorAll(".menu-category").forEach((sec) => {
          sec.style.display = cat === "all" || sec.dataset.cat === cat ? "block" : "none";
        });
      });
    });
  } catch (err) {
    loading.style.display = "none";
    errorBox.style.display = "block";
    errorBox.textContent = "Couldn't load the menu right now. Please try again shortly.";
    console.error(err);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
