const nodemailer = require("nodemailer");

/**
 * Sends an email using either Brevo (transactional API) or Gmail SMTP,
 * depending on EMAIL_METHOD in .env. Both are free-tier options.
 *
 * @param {Object} opts
 * @param {string} opts.to - recipient email
 * @param {string} opts.subject - email subject
 * @param {string} opts.html - email HTML body
 */
async function sendEmail({ to, subject, html }) {
  const method = (process.env.EMAIL_METHOD || "brevo").toLowerCase();

  if (method === "brevo") {
    return sendViaBrevo({ to, subject, html });
  }
  return sendViaGmail({ to, subject, html });
}

async function sendViaBrevo({ to, subject, html }) {
  const fromHeader = process.env.EMAIL_FROM || "Kamil Cafe <no-reply@kamilcafe.in>";
  const match = fromHeader.match(/^(.*)<(.*)>$/);
  const senderName = match ? match[1].trim() : "Kamil Cafe";
  const senderEmail = match ? match[2].trim() : fromHeader;

  // Direct call to Brevo's transactional email REST API (no SDK dependency needed - Node 18+ has native fetch)
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Brevo email failed (${res.status}): ${errBody}`);
  }
}

async function sendViaGmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `Kamil Cafe <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendEmail;
