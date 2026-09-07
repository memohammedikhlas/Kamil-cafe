requireAuth();

  const statusFilter = document.getElementById("statusFilter");
  const dateFilter = document.getElementById("dateFilter");
  document.getElementById("clearFilters").addEventListener("click", () => {
    statusFilter.value = "";
    dateFilter.value = "";
    loadBookings();
  });
  statusFilter.addEventListener("change", loadBookings);
  dateFilter.addEventListener("change", loadBookings);

  async function loadBookings() {
    const tbody = document.getElementById("bookingsBody");
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px;">Loading…</td></tr>`;

    const params = new URLSearchParams();
    if (statusFilter.value) params.set("status", statusFilter.value);
    if (dateFilter.value) params.set("date", dateFilter.value);

    try {
      const res = await authFetch(`${API_BASE_URL}/bookings?${params.toString()}`);
      const bookings = await res.json();

      if (!bookings.length) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No bookings found.</td></tr>`;
        return;
      }

      tbody.innerHTML = bookings
        .map(
          (b) => `
        <tr data-id="${b._id}">
          <td>${escapeHtml(b.name)}${b.email ? `<br><span style="color:var(--taupe-dim); font-size:0.8rem;">${escapeHtml(b.email)}</span>` : ""}</td>
          <td>${escapeHtml(b.phone)}</td>
          <td>${escapeHtml(b.date)}</td>
          <td>${escapeHtml(b.time)}</td>
          <td>${escapeHtml(b.guests)}</td>
          <td style="text-transform:capitalize;">${escapeHtml(b.occasion)}</td>
          <td><span class="pill pill-${escapeHtml(b.status)}">${escapeHtml(b.status)}</span></td>
          <td>
            <div class="table-actions">
              ${b.status !== "confirmed" ? `<button class="btn btn-sm btn-primary" data-action="confirm">Confirm</button>` : ""}
              ${b.status !== "cancelled" ? `<button class="btn btn-sm btn-outline" data-action="cancel">Cancel</button>` : ""}
              <button class="btn btn-sm btn-danger" data-action="delete">Delete</button>
            </div>
          </td>
        </tr>`
        )
        .join("");
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="8" class="empty-state">Couldn't load bookings.</td></tr>`;
    }
  }

  // Event delegation - no inline onclick handlers (keeps the strict CSP happy)
  document.getElementById("bookingsBody").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.closest("tr").dataset.id;
    const action = btn.dataset.action;

    try {
      if (action === "confirm" || action === "cancel") {
        const res = await authFetch(`${API_BASE_URL}/bookings/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action === "confirm" ? "confirmed" : "cancelled" }),
        });
        if (!res.ok) throw new Error("Failed to update booking");
        loadBookings();
      } else if (action === "delete") {
        if (!confirm("Delete this booking permanently?")) return;
        const res = await authFetch(`${API_BASE_URL}/bookings/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete booking");
        loadBookings();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  loadBookings();
