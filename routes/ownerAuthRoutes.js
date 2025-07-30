const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Owner = require('../models/Owner');
const Order = require('../models/Order');
const verifyOwner = require('../middleware/verifyOwner');

// ✅ Controller
const { getOrdersByContact } = require('../controllers/orderController');

// 🔐 Owner Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🛒 Get all orders (Owner only)
router.get('/orders', verifyOwner, async (req, res) => {
  try {
    const orders = await Order.find().populate('cakeId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// 🛒 Place an order
router.post('/orders', async (req, res) => {
  const { cakeId, customerName, contactNumber, address } = req.body;

  try {
    const newOrder = new Order({
      cakeId,
      customerName,
      contact: contactNumber, // ✅ Fix field name to match the schema
      address,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// 🔍 Get orders by customer name (public)
// router.get('/orders/search', async (req, res) => {
//   try {
//     const { customerName } = req.query;

//     const orders = customerName
//       ? await Order.find({ customerName })
//       : await Order.find();

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// });

// 📞 Get orders by contact number (Controller-based)
router.get('/orders/by-contact', getOrdersByContact);

module.exports = router;
