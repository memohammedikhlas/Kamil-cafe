const Admin = require("../models/Admin");
const { isStrongPassword } = require("./passwordStrength");

// Called once after the DB connects on every server startup. If
// ADMIN_USERNAME and ADMIN_PASSWORD are set in .env, this makes the admin
// account match them exactly - so changing a password is just "edit .env,
// restart the server" (which Render already does automatically whenever you
// update an environment variable there - no separate seed command needed).
//
// If these env vars are NOT set, this does nothing at all - existing admin
// accounts (e.g. created earlier via `npm run seed:admin`) are left untouched.
async function syncAdminFromEnv() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) return; // feature not in use - nothing to do

  const strength = isStrongPassword(password);
  if (!strength.ok) {
    console.warn(
      `ADMIN_PASSWORD in .env is too weak (missing: ${strength.failed.join(", ")}) - skipping admin sync. ` +
        "Existing admin login (if any) is unchanged. Needs 10+ characters with upper, lower, number, and special character."
    );
    return;
  }

  try {
    const normalizedUsername = username.toLowerCase().trim();

    // Enforce a single admin matching .env exactly - removes any other
    // leftover admin accounts (e.g. from an earlier manual seed with a
    // different username) so there's never ambiguity about which login works.
    await Admin.deleteMany({ username: { $ne: normalizedUsername } });

    let admin = await Admin.findOne({ username: normalizedUsername });
    if (!admin) {
      admin = new Admin({ username, password });
    } else {
      admin.password = password; // re-hashed by the pre-save hook regardless of whether it changed - cheap, and simplest to reason about
    }
    await admin.save();

    console.log(`Admin account synced from .env (username: ${normalizedUsername}).`);
  } catch (err) {
    console.error("Admin sync from .env failed:", err.message);
  }
}

module.exports = syncAdminFromEnv;
