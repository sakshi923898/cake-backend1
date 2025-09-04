const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner"); // make sure path is correct

const ownerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { ownerId: owner._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    console.error("❌ Owner login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { ownerLogin };
