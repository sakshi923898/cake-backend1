
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName:{ String, 
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: String,
  cakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cake'
  },
  status: {
    type: String,
    default: 'Pending'
  }
}, { timestamps: true }); // ✅ This adds createdAt and updatedAt

module.exports = mongoose.model('Order', orderSchema);


