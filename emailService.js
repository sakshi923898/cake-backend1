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
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465, // ✅ secure SSL port
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // your Gmail address
    pass: process.env.SMTP_PASS, // your Gmail App Password
  },
  tls: {
    rejectUnauthorized: false, // ✅ ignore certificate issue
  },
});

transporter.verify()
  .then(() => console.log('✅ Email transporter ready'))
  .catch(err => console.error('❌ Email transporter verify failed:', err));
