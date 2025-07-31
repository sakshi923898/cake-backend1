const Order = require("../models/Order"); // Adjust path if needed

const getOrdersByContact = async (req, res) => {
  const contact = req.query.contact;

  if (!contact) {
    return res.status(400).json({ message: "Contact number is required" });
  }

  try {
    const orders = await Order.find({ contactNumber: contact });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getOrdersByContact };
