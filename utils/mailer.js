// backend/utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailToOwners = async (owners, subject, message) => {
  const emailList = owners.map(owner => owner.email);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailList,
    subject,
    text: message,
  };

  try {
    console.log("📨 Attempting to send email to:", emailList);
    console.log("Mail options:", mailOptions);
    await transporter.sendMail(mailOptions);
    console.log("📧 Order email sent to:", emailList);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message); // show message only
    throw new Error("Email failed");

  }
};


module.exports = sendEmailToOwners;
