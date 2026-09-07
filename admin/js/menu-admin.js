requireAuth();

  let allItems = [];
  const modal = document.getElementById("itemModal");
  const form = document.getElementById("itemForm");
  const modalMsg = document.getElementById("modalMsg");

  document.getElementById("addItemBtn").addEventListener("click", () => openModal());
  document.getElementById("modalCancelBtn").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  function openModal(item = null) {
    form.reset();
    modalMsg.style.display = "none";
    document.getElementById("modalTitle").textContent = item ? "Edit Item" : "Add Item";
    document.getElementById("itemId").value = item ? item._id : "";
    document.getElementById("itemName").value = item ? item.name : "";
    document.getElementById("itemCategory").value = item ? item.category : "";
    document.getElementById("itemPrice").value = item ? item.price : "";
    document.getElementById("itemDiet").value = item ? item.dietTag : "veg";
    document.getElementById("itemAvailable").value = item ? String(item.available) : "true";
    modal.classList.add("open");
  }
  function closeModal() { modal.classList.remove("open"); }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("itemId").value;
    const payload = {
      name: document.getElementById("itemName").value.trim(),
      category: document.getElementById("itemCategory").value.trim(),
      price: Number(document.getElementById("itemPrice").value),
      dietTag: document.getElementById("itemDiet").value,
      available: document.getElementById("itemAvailable").value === "true",
    };

    const saveBtn = document.getElementById("modalSaveBtn");
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {
      const url = id ? `${API_BASE_URL}/menu/${id}` : `${API_BASE_URL}/menu`;
      const method = id ? "PUT" : "POST";
      const res = await authFetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.message || "Failed to save item"); }
      closeModal();
      loadMenu();
    } catch (err) {
      modalMsg.className = "form-msg error";
      modalMsg.textContent = err.message;
      modalMsg.style.display = "block";
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Item";
    }
  });

  document.getElementById("searchInput").addEventListener("input", renderTable);
  document.getElementById("categoryFilter").addEventListener("change", renderTable);

  async function loadMenu() {
    try {
      const res = await authFetch(`${API_BASE_URL}/menu?all=true`);
      allItems = await res.json();

      const categories = [...new Set(allItems.map((i) => i.category))].sort();
      const catFilter = document.getElementById("categoryFilter");
      const catList = document.getElementById("categoryOptions");
      catFilter.innerHTML = `<option value="">All Categories</option>` + categories.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
      catList.innerHTML = categories.map((c) => `<option value="${escapeHtml(c)}">`).join("");

      renderTable();
    } catch (err) {
      console.error(err);
    }
  }

  function renderTable() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const cat = document.getElementById("categoryFilter").value;
    const tbody = document.getElementById("menuBody");

    let filtered = allItems;
    if (search) filtered = filtered.filter((i) => i.name.toLowerCase().includes(search));
    if (cat) filtered = filtered.filter((i) => i.category === cat);

    if (!filtered.length) { tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No items found.</td></tr>`; return; }

    tbody.innerHTML = filtered
      .map(
        (item) => `
      <tr data-id="${item._id}">
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.category)}</td>
        <td>&#8377;${escapeHtml(item.price)}</td>
        <td>${item.dietTag === "jain" ? '<span class="jain-pill">Jain</span>' : "Veg"}</td>
        <td><span class="pill ${item.available ? "pill-confirmed" : "pill-cancelled"}" data-action="toggle" style="cursor:pointer;">${item.available ? "Available" : "Unavailable"}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-outline" data-action="edit">Edit</button>
            <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
          </div>
        </td>
      </tr>`
      )
      .join("");
  }

  document.getElementById("menuBody").addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const id = target.closest("tr").dataset.id;
    const action = target.dataset.action;
    const item = allItems.find((i) => i._id === id);

    try {
      if (action === "edit") {
        openModal(item);
      } else if (action === "toggle") {
        const res = await authFetch(`${API_BASE_URL}/menu/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ available: !item.available }) });
        if (!res.ok) throw new Error("Failed to update");
        loadMenu();
      } else if (action === "delete") {
        if (!confirm("Delete this item permanently?")) return;
        const res = await authFetch(`${API_BASE_URL}/menu/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete item");
        loadMenu();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  loadMenu();
