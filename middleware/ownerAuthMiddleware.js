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
const jwt = require("jsonwebtoken");

const verifyOwnerToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.owner = decoded; // this contains { ownerId, email, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyOwnerToken;
