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
  service: 'custo5172@gmail', // use 'gmail' for Gmail accounts
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
  // Optional: avoid certificate errors in some environments
  tls: {
    rejectUnauthorized: false,
  },
});

// Optional quick verify to log transporter readiness (useful on startup)
transporter.verify().then(() => {
  console.log('✅ Email transporter is ready');
}).catch(err => {
  console.error('❌ Email transporter verify failed:', err.message || err);
});

async function sendOrderNotification(toEmail, order) {
  const subject = `New Order from ${order.customerName}`;
  const text = `
New order received:

Customer: ${order.customerName}
Contact: ${order.contact}
Address: ${order.address}
Cake ID: ${order.cakeId}
Order ID: ${order._id}
Placed At: ${order.createdAt}
`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification email sent:', info.response || info.messageId);
    return info;
  } catch (err) {
    console.error('❌ Error sending email:', err && err.message ? err.message : err);
    throw err;
  }
}

module.exports = { sendOrderNotification };
