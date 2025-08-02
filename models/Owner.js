const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;
