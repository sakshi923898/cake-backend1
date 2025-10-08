//routes/ownerAuthRoutes.js
const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const verifyOwner = require('../middleware/verifyOwner');
import { sendOrderEmail } from "../emailService.js";
import Notification from "../models/Notification.js";

// ✅ Owner Dashboard route (protected)
router.get("/dashboard", require("../middleware/ownerAuthMiddleware"), (req, res) => {
  res.json({
    message: "Welcome to Owner Dashboard",
    owner: req.owner
  });
});

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const owner = await Owner.findOne({ email: email });

//     if (!owner) {
//       return res.status(404).json({ message: 'Owner not found' });
//     }

//     // const isMatch = await bcrypt.compare(password, owner.password);
//     // const isMatch = await bcrypt.compare(password, owner.hashedPassword);
//     const isMatch = await bcrypt.compare(password, owner.password);


//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, {
//       expiresIn: '1d',
//     });

//     res.status(200).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// TEMPORARY SAFE OWNER LOGIN (for testing)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🧠 Login attempt:', email);

  try {
    const owner = await Owner.findOne({ email });

    if (!owner) {
      console.log('❌ Owner not found');
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Use bcrypt.compare() because the password in DB is hashed
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      console.log('❌ Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ ownerId: owner._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    console.log('✅ Login successful');
    res.status(200).json({ token });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/orders', verifyOwner, async (req, res) => {
  try {
    const orders = await Order.find().populate('cakeId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

//TEMPORARY ROUTE TO ADD DEFAULT OWNER ON RENDER

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
// TEMPORARY DELETE ALL ORDERS ROUTE


// router.post('/orders', async (req, res) => {
//   const { cakeId, customerName, contactNumber, address } = req.body;

//   try {
//     const newOrder = new Order({
//       cakeId,
//       customerName,
//       contact, // ✅ important
//       address,
//     });

//     const cake = await Cake.findById(cakeId);
//     const notification = new Notification({
//       message: `New order for ${cake.name} from ${customerName}`,
//       isRead: false,
//     });
//         await notification.save();

//     await newOrder.save();
//     res.status(201).json({ message: 'Order placed successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to place order' });
//   }
// });


router.post("/", async (req, res) => {
  try {
    const { cakeName, cakeId, customerName, address, contact } = req.body;

    const newOrder = new Order({
      cakeName,
      cakeId,
      customerName,
      address,
      contact,
      createdAt: new Date(),
      status: "Pending"
    });
    await newOrder.save();

    // Persist a notification in DB for UI
    try {
      await Notification.create({
        message: `New order by ${customerName} (${contact}) for ${cakeName || cakeId}`,
        orderId: newOrder._id,
        createdAt: new Date()
      });
    } catch (notifErr) {
      console.error("Failed to save DB notification:", notifErr);
      // don't block main flow
    }

    // Find the owner's email saved in DB (if you store owner)
    let ownerEmail = process.env.EMAIL_USER; // fallback
    try {
      const owner = await Owner.findOne(); // assuming single owner
      if (owner && owner.email) ownerEmail = owner.email;
    } catch (ownerErr) {
      console.error("Owner lookup error:", ownerErr);
    }

    // Attempt to send email (non-blocking for API success)
    const emailResult = await sendOrderEmail(ownerEmail, newOrder);
    if (!emailResult.ok) {
      // Log and allow response — UI can show in-app notification
      console.warn("Email not sent; will still return success. error:", emailResult.error);
    }

    return res.status(201).json({ message: "Order placed", order: newOrder, emailSent: !!emailResult.ok });

  } catch (err) {
    console.error("Order create error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ message: "Failed to place order", error: err.message || err });
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





// DELETE specific order by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting order' });
  }
});

module.exports = router;
