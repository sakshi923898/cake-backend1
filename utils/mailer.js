// backend/utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // ✅ Correct usage
    pass: process.env.EMAIL_PASS, // ✅ Correct usage
  },
});

const sendOrderNotification = async (customerName, cakeName, customerContact) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "🎂 New Cake Order Placed!",
    html: `
      <h2>New Cake Order</h2>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Cake:</strong> ${cakeName}</p>
      <p><strong>Contact:</strong> ${customerContact}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Order notification sent to owner!");
  } catch (error) {
    console.error("❌ Failed to send order email:", error);
  }
};

module.exports = sendOrderNotification;
