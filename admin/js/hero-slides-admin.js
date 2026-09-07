requireAuth();

  const uploadForm = document.getElementById("uploadForm");
  const uploadMsg = document.getElementById("uploadMsg");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("heroFile");
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("caption", document.getElementById("heroCaption").value.trim());

    const btn = document.getElementById("uploadBtn");
    btn.disabled = true;
    btn.textContent = "Uploading...";
    uploadMsg.style.display = "none";

    try {
      const res = await authFetch(`${API_BASE_URL}/hero-slides`, { method: "POST", body: formData });
      if (!res.ok) { const data = await res.json(); throw new Error(data.message || "Upload failed"); }
      uploadForm.reset();
      loadSlides();
    } catch (err) {
      uploadMsg.className = "form-msg error";
      uploadMsg.textContent = err.message;
      uploadMsg.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.textContent = "Upload Photo";
    }
  });

  async function loadSlides() {
    const grid = document.getElementById("heroGrid");
    try {
      const res = await authFetch(`${API_BASE_URL}/hero-slides?all=true`);
      const slides = await res.json();

      if (!slides.length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">No hero photos uploaded yet. The homepage will show a placeholder until you add one.</div>`; return; }

      grid.innerHTML = slides
        .map(
          (s) => `
        <div data-id="${s._id}">
          <div class="thumb-item">
            <img src="${UPLOADS_BASE_URL}/${s.filename}" alt="${escapeHtml(s.caption || "")}">
            <button class="thumb-remove" data-action="delete" aria-label="Delete">&times;</button>
          </div>
          <div class="thumb-caption">
            ${escapeHtml(s.caption || "Untitled")} &middot;
            <span data-action="toggle" data-active="${s.active}" style="cursor:pointer; color:${s.active ? "#6FBE7A" : "var(--taupe-dim)"};">${s.active ? "Active" : "Hidden"}</span>
          </div>
        </div>`
        )
        .join("");
    } catch (err) {
      console.error(err);
    }
  }

  document.getElementById("heroGrid").addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const wrapper = target.closest("[data-id]");
    if (!wrapper) return;
    const slideId = wrapper.dataset.id;
    const action = target.dataset.action;

    try {
      if (action === "delete") {
        if (!confirm("Delete this photo?")) return;
        const res = await authFetch(`${API_BASE_URL}/hero-slides/${slideId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        loadSlides();
      } else if (action === "toggle") {
        const isActive = target.dataset.active === "true";
        const res = await authFetch(`${API_BASE_URL}/hero-slides/${slideId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !isActive }) });
        if (!res.ok) throw new Error("Failed to update");
        loadSlides();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  loadSlides();
