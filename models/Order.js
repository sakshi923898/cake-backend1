const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cakeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cake', required: true },
  customerName: { type: String, required: true },
  customerContact: { type: String, required: true },
  status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Order', orderSchema);
