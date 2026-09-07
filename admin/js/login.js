if (getToken()) window.location.href = "dashboard.html";

// On mobile, the on-screen keyboard can cover the focused field even with
// the CSS scroll-room fix in place - explicitly scroll it into view too,
// after a short delay so it runs once the keyboard has actually opened
// (an immediate scroll happens before the viewport has resized).
["username", "password"].forEach((id) => {
  document.getElementById(id).addEventListener("focus", (e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  });
});

document.getElementById("passwordToggle").addEventListener("click", () => {
  const input = document.getElementById("password");
  const btn = document.getElementById("passwordToggle");
  const eyeIcon = document.getElementById("eyeIcon");
  const isHidden = input.type === "password";

  input.type = isHidden ? "text" : "password";
  btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  btn.setAttribute("aria-pressed", String(isHidden));

  // Swap between an open eye (password hidden, tap to reveal) and a
  // slashed eye (password visible, tap to hide again).
  eyeIcon.innerHTML = isHidden
    ? '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/><line x1="2" y1="2" x2="22" y2="22"/>'
    : '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>';
});

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("loginMsg");
    const btn = document.getElementById("loginBtn");
    msg.style.display = "none";
    btn.disabled = true;
    btn.textContent = "Logging in...";

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: document.getElementById("username").value.trim(),
          password: document.getElementById("password").value,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setAuth(data.token, data.username);
      window.location.href = "dashboard.html";
    } catch (err) {
      msg.className = "form-msg error";
      msg.textContent = err.message || "Invalid username or password";
      msg.style.display = "block";
    } finally {
      btn.disabled = false;
      btn.textContent = "Log In";
    }
  });
