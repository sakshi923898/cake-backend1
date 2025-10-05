// const mongoose = require('mongoose');

// const ownerSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   hashedPassword: {
//     type: String,
//     required: true,
//   },
// });

// const Owner = mongoose.model('Owner', ownerSchema);

// module.exports = Owner;
// backend/models/Owner.js
const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
