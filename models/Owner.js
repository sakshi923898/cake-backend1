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
// models/Owner.js
const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:{ type: String, required: true },  // <-- bcrypt hash lives here
  notify:  { type: Boolean, default: true }   // owners with notify=true receive emails
});

module.exports = mongoose.model('Owner', ownerSchema);
