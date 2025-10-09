
// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   customerName:{ String, 
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


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // ✅ Correct syntax
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cakeName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
