// // emailService.js
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'satyavita81@gmail.com', // or your SMTP service
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
import nodemailer from "nodemailer";

router.post("/orders", async (req, res) => {
  const { cakeName, customerName, address, contact } = req.body;

  try {
    const newOrder = new Order({
      cakeName,
      customerName,
      address,
      contact,
    });
    await newOrder.save();

    // ✅ Send email to owner
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Owner receives the notification
      subject: "🎂 New Cake Order Received",
      text: `Hello Owner,\n\nA new order has been placed!\n\nCustomer: ${customerName}\nCake: ${cakeName}\nAddress: ${address}\nContact: ${contact}\n\nPlease log in to your dashboard to confirm delivery.\n\n- Cake Shop System`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Order placed and owner notified" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order" });
  }
});
