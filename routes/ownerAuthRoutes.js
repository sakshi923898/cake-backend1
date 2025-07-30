const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const verifyOwner = require('../middleware/verifyOwner');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await Owner.findOne({ email: email });

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const isMatch = await bcrypt.compare(password, owner.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/orders', verifyOwner, async (req, res) => {
  try {
    const orders = await Order.find().populate('cakeId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

// TEMPORARY ROUTE TO ADD DEFAULT OWNER ON RENDER
// router.post('/create-test-owner', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const existingOwner = await Owner.findOne({ email });
//     if (existingOwner) {
//       return res.status(400).json({ message: 'Owner already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newOwner = new Owner({
//       email,
//       password: hashedPassword
//     });

//     await newOwner.save();
//     res.status(201).json({ message: 'Test owner created successfully' });
//   } catch (error) {
//     console.error('Error creating test owner:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
router.post('/orders', async (req, res) => {
  const { cakeId, customerName, contactNumber, address } = req.body;
  
  try {
    const newOrder = new Order({
      cakeId,
      customerName,
      contact, // ✅ important
      address,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});
// Example: GET /api/orders?customerName=Sakshi
router.get("/orders", async (req, res) => {
  try {
    const { customerName } = req.query;

    let orders;
    if (customerName) {
      orders = await Order.find({ customerName }); // Filter only that customer's orders
    } else {
      orders = await Order.find(); // Owner gets all orders
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


// GET orders by contact number
// router.post('/by-contact', async (req, res) => {
//   const { contact } = req.body;
//   try {
//     const orders = await Order.find({ contact }).populate('cakeId');
//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ message: 'Contact not found. Please place an order first.' });
//     }
//     res.json(orders);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// Get orders by contact number
router.get('/by-contact', async (req, res) => {
  try {
    const contact = req.query.contact;

    if (!contact) {
      return res.status(400).json({ message: 'Contact number is required' });
    }

    const orders = await Order.find({ contact });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Contact not found. Please place an order first.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
