// Token-based auth helper for the admin dashboard.
const AUTH_KEY = "kc_admin_token";
const AUTH_USER_KEY = "kc_admin_username";

function getToken() {
  return localStorage.getItem(AUTH_KEY);
}

function getUsername() {
  return localStorage.getItem(AUTH_USER_KEY);
}

function setAuth(token, username) {
  localStorage.setItem(AUTH_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, username);
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

// Call this at the top of every protected admin page.
function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
  }
}

// Authenticated fetch wrapper - auto-attaches token, redirects to login on 401.
async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = { ...(options.headers || {}), Authorization: `Bearer ${token}` };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    clearAuth();
    window.location.href = "login.html";
    throw new Error("Session expired");
  }
  return res;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      window.location.href = "login.html";
    });
  }
  const usernameLabel = document.getElementById("adminUsernameLabel");
  if (usernameLabel) usernameLabel.textContent = getUsername() || "Admin";

  // Wire up any "back to live site" links using the configured FRONTEND_URL
  document.querySelectorAll("[data-frontend-link]").forEach((el) => {
    const path = el.getAttribute("data-frontend-link") || "";
    el.href = `${FRONTEND_URL}/${path}`.replace(/([^:]\/)\/+/g, "$1");
  });
});
