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

import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send order email to the owner
export const sendOrderEmail = async (orderDetails) => {
  try {
    await resend.emails.send({
      from: 'Cake Shop <onboarding@resend.dev>', // required by Resend
      to: process.env.OWNER_EMAIL,
      subject: '🎂 New Cake Order Received!',
      html: `
        <h2>New Order Notification</h2>
        <p><strong>Customer:</strong> ${orderDetails.name}</p>
        <p><strong>Email:</strong> ${orderDetails.email}</p>
        <p><strong>Cake Name:</strong> ${orderDetails.cakeName}</p>
        <p><strong>Price:</strong> ₹${orderDetails.price}</p>
        <p><strong>Message:</strong> ${orderDetails.message}</p>
        <hr>
        <p>Please prepare the cake as soon as possible 🍰</p>
      `,
    });

    console.log('✅ Email sent to owner successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
