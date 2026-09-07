requireAuth();

  async function loadOverview() {
    try {
      const statsRes = await authFetch(`${API_BASE_URL}/bookings/stats`);
      const stats = await statsRes.json();
      document.getElementById("statToday").textContent = stats.today;
      document.getElementById("statWeek").textContent = stats.thisWeek;
      document.getElementById("statPending").textContent = stats.pending;

      const bookingsRes = await authFetch(`${API_BASE_URL}/bookings`);
      const bookings = await bookingsRes.json();
      const recent = bookings.slice(0, 6);
      const tbody = document.getElementById("recentBookingsBody");

      if (!recent.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No bookings yet.</td></tr>`;
        return;
      }

      tbody.innerHTML = recent
        .map(
          (b) => `
        <tr>
          <td>${escapeHtml(b.name)}</td>
          <td>${escapeHtml(b.date)}</td>
          <td>${escapeHtml(b.time)}</td>
          <td>${escapeHtml(b.guests)}</td>
          <td><span class="pill pill-${escapeHtml(b.status)}">${escapeHtml(b.status)}</span></td>
        </tr>`
        )
        .join("");
    } catch (err) {
      console.error(err);
    }
  }

  loadOverview();
