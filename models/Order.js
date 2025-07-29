const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
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
});

module.exports = mongoose.model('Order', orderSchema);
