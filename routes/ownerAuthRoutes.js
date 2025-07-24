const express = require('express');
const router = express.Router();
const Owner = require('../models/Owner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


// TEMPORARY ROUTE TO ADD DEFAULT OWNER ON RENDER
router.post('/create-test-owner', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');

    // Replace with your actual owner email and password
    const email = 'satyavita81@gmail.com';
    const plainPassword = 'Swapn1234';

    // Check if already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: 'Owner already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create new owner
    const newOwner = new Owner({ email, password: hashedPassword });
    await newOwner.save();

    res.status(201).json({ message: '✅ Owner created successfully on Render DB' });
  } catch (error) {
    res.status(500).json({ message: '❌ Error creating owner', error: error.message });
  }
});

module.exports = router;
