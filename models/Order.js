
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//    name: {
//     type: String,
//     required: true,
//   },
//   contact: {
//     type: String,
//     required: true,
//   },
//   address: String,
//   cakeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Cake'
//   },
//   status: {
//     type: String,
//     default: 'Pending'
//   }
// }, { timestamps: true }); // ✅ This adds createdAt and updatedAt

// module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  cakeName: {            // ✅ Added
    type: String,
    required: true,
  },
  price: {               // ✅ Added
    type: Number,
    required: true,
  },
  cakeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cake',
  },
  status: {
    type: String,
    default: 'Pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
