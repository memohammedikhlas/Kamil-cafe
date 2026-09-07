// Creates/updates the admin login for the dashboard - a one-off CLI version
// of the same sync that also runs automatically every time the server boots
// (see utils/syncAdminFromEnv.js). Useful for running the sync once without
// restarting the whole server (e.g. from Render's Shell).
//
// Reads ADMIN_USERNAME and ADMIN_PASSWORD from .env. Run with: npm run seed:admin
require("dotenv").config();
const connectDB = require("../config/db");
const syncAdminFromEnv = require("../utils/syncAdminFromEnv");

const run = async () => {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    console.error("Set ADMIN_USERNAME and ADMIN_PASSWORD in your .env file first, then re-run this.");
    process.exit(1);
  }

  await connectDB();
  await syncAdminFromEnv();
  console.log("Note this down somewhere safe (e.g. a password manager) if you haven't already.");
  process.exit(0);
};

run();
