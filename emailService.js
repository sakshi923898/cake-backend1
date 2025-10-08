// // emailService.js
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'custo5172@gmail.com', // or your SMTP service
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// async function sendOrderNotification(toEmail, order) {
//   const subject = `New Order from ${order.customerName}`;
//   const text = `
// New order received:

// Customer: ${order.customerName}
// Contact:  ${order.contact}
// Address:  ${order.address}
// Order ID: ${order._id}
// Placed At: ${order.createdAt}
// `;

//   await transporter.sendMail({
//     from: process.env.SMTP_USER,
//     to: toEmail,
//     subject,
//     text,
//   });
// }

// module.exports = { sendOrderNotification };



// backend/emailService.js
const nodemailer = require("nodemailer");

/**
 * Creates and returns a transporter. We set explicit host/port/secure
 * so errors are clearer. transporter.verify() can show immediate issues.
 */
export function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.error("⚠️ EMAIL_USER or EMAIL_PASS not set in environment");
    return null;
  }

  // Use secure port 465 (SSL) for Gmail
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
    // optional pool config for production:
    // pool: true,
    // maxConnections: 5,
    // maxMessages: 100
  });

  // non-blocking verify — logs outcome
  transporter.verify()
    .then(() => console.log("✅ Email transporter verified"))
    .catch(err => console.error("❌ Email transporter verify failed:", err && err.message ? err.message : err));

  return transporter;
}

/**
 * sendOrderEmail(to, orderObject)
 * returns { ok: true } on success, or { ok: false, error } on failure
 */
export async function sendOrderEmail(toEmail, order) {
  const transporter = createTransporter();
  if (!transporter) {
    return { ok: false, error: "Transporter not configured (missing env)" };
  }

  const subject = `New Order: ${order.cakeName || order.cakeId || "Cake"}`;
  const text = `Hello Owner,

A new order has been placed.

Customer: ${order.customerName || "N/A"}
Cake: ${order.cakeName || order.cakeId || "N/A"}
Contact: ${order.contact || "N/A"}
Address: ${order.address || "N/A"}

Order ID: ${order._id || "N/A"}

Please login to confirm or manage the order.
`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 sendOrderEmail success:", info && (info.messageId || info.response) ? (info.messageId || info.response) : info);
    return { ok: true };
  } catch (err) {
    console.error("❌ sendOrderEmail failed:", err && err.message ? err.message : err);
    return { ok: false, error: (err && err.message) || err };
  }
}
module.exports = { createTransporter };
