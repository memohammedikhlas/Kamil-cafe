// Shared strength check used by both the manual seed script and the
// automatic env-based admin sync, so the rule lives in exactly one place.
// Requires: 10+ characters, at least one uppercase, one lowercase,
// one number, and one special character.
function isStrongPassword(pw) {
  const checks = {
    length: typeof pw === "string" && pw.length >= 10,
    upper: /[A-Z]/.test(pw || ""),
    lower: /[a-z]/.test(pw || ""),
    number: /[0-9]/.test(pw || ""),
    special: /[^A-Za-z0-9]/.test(pw || ""),
  };
  const failed = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);
  return { ok: failed.length === 0, failed };
}

module.exports = { isStrongPassword };
