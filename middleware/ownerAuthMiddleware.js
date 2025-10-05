// const jwt = require('jsonwebtoken');

// const verifyOwnerToken = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) return res.status(401).json({ message: 'Access denied. No token.' });

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SECRET);
//     req.owner = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// module.exports = verifyOwnerToken;


// middleware/ownerAuth.js

// middleware/ownerAuth.js
const jwt = require("jsonwebtoken");

const verifyOwnerToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Expected format: "Bearer <token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Use secret from .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.owner = decoded; // { ownerId, iat, exp }
    next();
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyOwnerToken;
