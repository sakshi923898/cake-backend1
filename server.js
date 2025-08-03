// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./config/cloudinary');
require('dotenv').config();

const ownerAuthRoutes = require('./routes/ownerAuthRoutes');
const Order = require('./models/Order');
const app = express();
const router = express.Router();
const Owner = require('./models/Owner');
const nodemailer = require('nodemailer');
 const sendEmailToOwners = require("../utils/mailer"); // Import the function
// const mailer = require('./utils/mailer');

/* ------------------------- Middleware Setup ------------------------ */

// ✅ CORS for frontend
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://samrth.netlify.app',
      'http://localhost:5173'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// app.use(cors(corsOptions));
app.use(cors({
  origin: 'https://samrth.netlify.app', // ✅ your frontend Netlify domain
  credentials: true,
}));
app.use(express.json());

/* ------------------------- MongoDB Connection ---------------------- */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

/* --------------------------- Models Setup -------------------------- */

const Cake = mongoose.model('Cake', new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String, // Cloudinary image URL
}));

/* ------------------------- File Upload Setup ----------------------- */

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cake-shop',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

/* ----------------------------- Routes ------------------------------ */

// ✅ Owner Auth Routes
app.use('/api/owner', ownerAuthRoutes);

// ✅ Get all cakes
app.get('/api/cakes', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cakes' });
  }
});

// ✅ Upload new cake
app.post('/api/cakes', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const imageUrl = req.file.path; // Cloudinary image URL
    const newCake = new Cake({ name, price, description, imageUrl });
    await newCake.save();
    res.status(201).json({ message: 'Cake added successfully', cake: newCake });
  } catch (error) {
    console.error('❌ Error uploading cake:', error);
    res.status(500).json({ message: 'Error uploading cake' });
  }
});

// ✅ Delete cake
app.delete('/api/cakes/:id', async (req, res) => {
  try {
    const cake = await Cake.findByIdAndDelete(req.params.id);
    if (!cake) return res.status(404).json({ message: 'Cake not found' });
    res.status(200).json({ message: 'Cake deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cake' });
  }
});

// ✅ Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('cakeId');
    res.json(orders);
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});
// Get orders of a specific customer



// ✅ Place a new order


// app.post('/api/orders', async (req, res) => {
//   try {
//     console.log('Order request body:', req.body);
//     const { cakeId, customerName, contact, address } = req.body;
//     const newOrder = new Order({ cakeId, customerName, contact, address });
//     await newOrder.save();

//     res.status(201).json({ message: 'Order placed successfully', order: newOrder });
//   } catch (error) {
//     console.error('Order error:', error);
//     res.status(500).json({ message: 'Failed to place order' });
//   }
// });


// ✅ Confirm order as delivered
app.patch('/api/orders/:id/confirm', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'Delivered';
    await order.save();
    res.status(200).json({ message: 'Order confirmed as delivered' });
  } catch (error) {
    console.error('❌ Error confirming delivery:', error);
    res.status(500).json({ message: 'Error confirming delivery' });
  }
});


app.post('/api/orders', async (req, res) => {
  try {
    console.log("✅ Step 1: Order route hit");

    const { cakeId, customerName, contactNumber } = req.body;
    console.log("✅ Step 2: Request data received:", req.body);

    // Step 3: Find the cake
    const cake = await Cake.findById(cakeId);
    if (!cake) {
      return res.status(404).json({ error: 'Cake not found' });
    }
    console.log("✅ Step 3: Cake found");

    // Step 4: Create the order
    const order = new Order({
      cake: cakeId,
      customerName,
      contactNumber,
      status: 'Pending',
    });
    await order.save();
    console.log("✅ Step 4: Order saved to DB");

    // Step 5: Find all owners
    const owners = await Owner.find();
    console.log("✅ Step 5: Owners fetched:", owners);

    // Step 6: Email Notification (✅ Wrapped in try-catch)
    const subject = "New Cake Order Received";
    const message = `
      Customer Name: ${customerName}
      Contact Number: ${contactNumber}
      Ordered Cake: ${cake.name}
    `;

    try {
      await sendEmailToOwners(owners, subject, message);
      console.log("✅ Step 6: Email sent");
    } catch (emailErr) {
      console.error("❌ Email failed but order saved:", emailErr.message);
    }

    res.status(201).json({ message: 'Order placed successfully!' });
  } catch (err) {
    console.error("❌ Main catch error:", err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});




/* ---------------------------- Server Start ------------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
