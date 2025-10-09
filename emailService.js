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
// backend/emailService.js
// const { Resend } = require('resend');
// require('dotenv').config();

// // Initialize Resend with your API key from environment variables
// const resend = new Resend(process.env.RESEND_API_KEY);

// async function sendOrderEmail(orderDetails) {
//   try {
//     const data = await resend.emails.send({
//       from: 'onboarding@resend.dev', // ✅ Must use verified or official sender
//       to: process.env.OWNER_EMAIL || 'custo5172@gmail.com', // fallback email
//       subject: '🎂 New Cake Order Received!',
//       html: `
//         <h2>New Order Notification</h2>
//         <p><strong>Customer Name:</strong> ${orderDetails.customerName}</p>
//         <p><strong>Contact:</strong> ${orderDetails.contact}</p>
//         <p><strong>Address:</strong> ${orderDetails.address}</p>
//         <hr>
        
//       `,
//     });

//     console.log('✅ Email sent successfully:', data);
//   } catch (error) {
//     console.error('❌ Error sending email:', error);
//   }
// }

// module.exports = { sendOrderEmail };

const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderEmail(orderDetails) {
  try {
    const { customerName, email, cakeName, price, message } = orderDetails;

    await resend.emails.send({
      from: 'Cake Shop <onboarding@resend.dev>',
      to: process.env.OWNER_EMAIL, // owner email (your email)
      subject: '🎂 New Cake Order Received!',
      html: `
        <h2>New Order Notification</h2>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Cake Name:</strong> ${cakeName}</p>
        <p><strong>Price:</strong> ₹${price}</p>
        <p><strong>Message:</strong> ${message}</p>
        <hr>
       
      `,
    });

    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

module.exports = { sendOrderEmail };

