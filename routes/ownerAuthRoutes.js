//routes/ownerAuthRoutes.js
const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const verifyOwner = require('../middleware/verifyOwner');


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
router.post('/simple-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🧠 Simple login attempt:", email);

    // Find owner
    const owner = await Owner.findOne({ email: email });
    if (!owner) {
      console.log("⚠️ Owner not found");
      return res.status(404).json({ message: 'Owner not found' });
    }

    // If owner has hashedPassword, compare properly
    const storedPassword = owner.hashedPassword || owner.password;

    // If password is stored as plain text (for testing)
    if (storedPassword === password) {
      console.log("✅ Plain password matched");
    } else if (storedPassword && storedPassword.startsWith('$2')) {
      // If hashed, use bcrypt
      const bcrypt = require('bcryptjs');
      const match = await bcrypt.compare(password, storedPassword);
      if (!match) {
        console.log("❌ Password incorrect");
        return res.status(401).json({ message: 'Invalid password' });
      }
    } else {
      console.log("❌ No valid password field found");
      return res.status(400).json({ message: 'Invalid password field' });
    }

    // Generate JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { ownerId: owner._id, email: owner.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("🎉 Login successful for:", owner.email);
    return res.status(200).json({ token });

  } catch (err) {
    console.error("🔥 Simple login error:", err);
    res.status(500).json({ message: 'Internal server error' });
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


router.post('/orders', async (req, res) => {
  const { cakeId, customerName, contactNumber, address } = req.body;

  try {
    const newOrder = new Order({
      cakeId,
      customerName,
      contact, // ✅ important
      address,
    });

    const cake = await Cake.findById(cakeId);
    const notification = new Notification({
      message: `New order for ${cake.name} from ${customerName}`,
      isRead: false,
    });
        await notification.save();

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
