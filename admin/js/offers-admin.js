requireAuth();

  let allOffers = [];
  const modal = document.getElementById("offerModal");
  const form = document.getElementById("offerForm");
  const modalMsg = document.getElementById("offerModalMsg");

  document.getElementById("addOfferBtn").addEventListener("click", () => openModal());
  document.getElementById("offerModalCancelBtn").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  function openModal(offer = null) {
    form.reset();
    modalMsg.style.display = "none";
    document.getElementById("offerModalTitle").textContent = offer ? "Edit Offer" : "Add Offer";
    document.getElementById("offerId").value = offer ? offer._id : "";
    document.getElementById("offerTitle").value = offer ? offer.title : "";
    document.getElementById("offerDescription").value = offer ? offer.description : "";
    document.getElementById("offerBadge").value = offer ? offer.badge : "";
    document.getElementById("offerValidTill").value = offer ? offer.validTill : "";
    document.getElementById("offerActive").value = offer ? String(offer.active) : "true";
    modal.classList.add("open");
  }
  function closeModal() { modal.classList.remove("open"); }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("offerId").value;
    const payload = {
      title: document.getElementById("offerTitle").value.trim(),
      description: document.getElementById("offerDescription").value.trim(),
      badge: document.getElementById("offerBadge").value.trim(),
      validTill: document.getElementById("offerValidTill").value.trim(),
      active: document.getElementById("offerActive").value === "true",
    };

    const saveBtn = document.getElementById("offerModalSaveBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {
      const url = id ? `${API_BASE_URL}/offers/${id}` : `${API_BASE_URL}/offers`;
      const method = id ? "PUT" : "POST";
      const res = await authFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.message || "Failed to save offer"); }
      closeModal();
      loadOffers();
    } catch (err) {
      modalMsg.className = "form-msg error";
      modalMsg.textContent = err.message;
      modalMsg.style.display = "block";
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Offer";
    }
  });

  async function loadOffers() {
    const tbody = document.getElementById("offersBody");
    try {
      const res = await authFetch(`${API_BASE_URL}/offers?all=true`);
      allOffers = await res.json();

      if (!allOffers.length) { tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No offers yet. Click "+ Add Offer" to create one.</td></tr>`; return; }

      tbody.innerHTML = allOffers
        .map(
          (o) => `
        <tr data-id="${o._id}">
          <td>${escapeHtml(o.title)}${o.description ? `<br><span style="color:var(--taupe-dim); font-size:0.8rem;">${escapeHtml(o.description)}</span>` : ""}</td>
          <td>${o.badge ? escapeHtml(o.badge) : "—"}</td>
          <td>${o.validTill ? escapeHtml(o.validTill) : "—"}</td>
          <td><span class="pill ${o.active ? "pill-confirmed" : "pill-cancelled"}" data-action="toggle" style="cursor:pointer;">${o.active ? "Active" : "Inactive"}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn btn-sm btn-outline" data-action="edit">Edit</button>
              <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
            </div>
          </td>
        </tr>`
        )
        .join("");
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Couldn't load offers.</td></tr>`;
    }
  }

  document.getElementById("offersBody").addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const id = target.closest("tr").dataset.id;
    const action = target.dataset.action;
    const offer = allOffers.find((o) => o._id === id);

    try {
      if (action === "edit") {
        openModal(offer);
      } else if (action === "toggle") {
        const res = await authFetch(`${API_BASE_URL}/offers/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !offer.active }) });
        if (!res.ok) throw new Error("Failed to update");
        loadOffers();
      } else if (action === "delete") {
        if (!confirm("Delete this offer permanently?")) return;
        const res = await authFetch(`${API_BASE_URL}/offers/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete offer");
        loadOffers();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  loadOffers();
