import nodemailer from "nodemailer";

export const sendOrderNotification = async (ownerEmail, order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP
      auth: {
        user: "your-email@gmail.com",
        pass: "your-app-password", // use App Password for Gmail
      },
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: ownerEmail,
      subject: "New Order Received 🎂",
      text: `A new order has been placed!\n\nCustomer: ${order.customerName}\nCake: ${order.cakeName}\nQuantity: ${order.quantity}\n\nCheck dashboard for details.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Order notification sent to owner!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
