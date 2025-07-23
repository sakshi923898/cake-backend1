const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner'); // make sure this is correct path

// POST /api/owner/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await Owner.findOne({ email });

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, owner.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { ownerId: owner._id },
      process.env.JWT_SECRET || 'defaultSecret', // fallback for local
      { expiresIn: '1d' }
    );

    res.json({ token, message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
