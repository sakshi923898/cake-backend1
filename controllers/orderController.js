// controllers/orderController.js

const Order = require("../models/Order"); // Make sure the path is correct

// GET /api/orders?contact=XXXXXXXXXX
const getOrdersByContact = async (req, res) => {
  const { contact } = req.query;

  if (!contact) {
    return res.status(400).json({ message: "Contact number is required" });
  }

  try {
    const orders = await Order.find({ contact });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this contact" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getOrdersByContact };
