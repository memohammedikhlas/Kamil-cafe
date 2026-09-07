requireAuth();

  const uploadForm = document.getElementById("uploadForm");
  const uploadMsg = document.getElementById("uploadMsg");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("galleryFile");
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("caption", document.getElementById("galleryCaption").value.trim());

    const btn = document.getElementById("uploadBtn");
    btn.disabled = true;
    btn.textContent = "Uploading...";
    uploadMsg.style.display = "none";

    try {
      const res = await authFetch(`${API_BASE_URL}/gallery`, { method: "POST", body: formData });
      if (!res.ok) { const data = await res.json(); throw new Error(data.message || "Upload failed"); }
      uploadForm.reset();
      loadGallery();
    } catch (err) {
      uploadMsg.className = "form-msg error";
      uploadMsg.textContent = err.message;
      uploadMsg.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.textContent = "Upload Photo";
    }
  });

  async function loadGallery() {
    const grid = document.getElementById("adminGalleryGrid");
    try {
      const res = await authFetch(`${API_BASE_URL}/gallery`);
      const images = await res.json();

      if (!images.length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">No photos uploaded yet.</div>`; return; }

      grid.innerHTML = images
        .map(
          (img) => `
        <div class="thumb-item" data-id="${img._id}">
          <img src="${UPLOADS_BASE_URL}/${img.filename}" alt="${escapeHtml(img.caption || "")}">
          <button class="thumb-remove" data-action="delete" aria-label="Delete">&times;</button>
        </div>`
        )
        .join("");
    } catch (err) {
      console.error(err);
    }
  }

  document.getElementById("adminGalleryGrid").addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action='delete']");
    if (!target) return;
    const id = target.closest("[data-id]").dataset.id;
    if (!confirm("Delete this photo?")) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      loadGallery();
    } catch (err) {
      alert(err.message);
    }
  });

  loadGallery();
