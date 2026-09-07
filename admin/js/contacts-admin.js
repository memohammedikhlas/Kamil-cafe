requireAuth();

  async function loadContacts() {
    const tbody = document.getElementById("contactsBody");
    try {
      const res = await authFetch(`${API_BASE_URL}/contacts`);
      const contacts = await res.json();

      if (!contacts.length) { tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No messages yet.</td></tr>`; return; }

      tbody.innerHTML = contacts
        .map(
          (c) => `
        <tr data-id="${c._id}">
          <td>${escapeHtml(c.name)}</td>
          <td>${escapeHtml(c.contactInfo)}</td>
          <td style="max-width:280px;">${escapeHtml(c.message)}</td>
          <td>${new Date(c.createdAt).toLocaleDateString()}</td>
          <td><span class="pill ${c.read ? "pill-read" : "pill-unread"}">${c.read ? "Read" : "New"}</span></td>
          <td>
            <div class="table-actions">
              ${!c.read ? `<button class="btn btn-sm btn-outline" data-action="read">Mark Read</button>` : ""}
              <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
            </div>
          </td>
        </tr>`
        )
        .join("");
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Couldn't load messages.</td></tr>`;
    }
  }

  document.getElementById("contactsBody").addEventListener("click", async (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const id = target.closest("tr").dataset.id;
    const action = target.dataset.action;

    try {
      if (action === "read") {
        const res = await authFetch(`${API_BASE_URL}/contacts/${id}/read`, { method: "PATCH" });
        if (!res.ok) throw new Error("Failed to update");
        loadContacts();
      } else if (action === "delete") {
        if (!confirm("Delete this message?")) return;
        const res = await authFetch(`${API_BASE_URL}/contacts/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        loadContacts();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  loadContacts();
