const Order = require('../models/Order');

const getOrdersByContact = async (req, res) => {
  try {
    const contact = req.query.contact;

    if (!contact) {
      return res.status(400).json({ message: 'Contact number is required' });
    }

    const orders = await Order.find({ contact }).populate('cakeId');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Contact not found. Please place an order first.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getOrdersByContact:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getOrdersByContact };
