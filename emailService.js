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

// backend/emailService.js
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderEmail(orderDetails) {
  try {
    await resend.emails.send({
      from: 'Cake Shop <onboarding@resend.dev>', // required by Resend
      to: process.env.OWNER_EMAIL,
      subject: '🎂 New Cake Order Received!',
      // html: `
      //   <h2>New Order Notification</h2>
      //   <p><strong>Customer Name:</strong> ${orderDetails.customerName}</p>
      //   <p><strong>Contact:</strong> ${orderDetails.contact}</p>
      //   <p><strong>Address:</strong> ${orderDetails.address}</p>
      //   <hr>
      //   <p>Please prepare the cake as soon as possible 🍰</p>
      // `,
    });

    console.log('✅ Email sent to owner successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

module.exports = { sendOrderEmail };
