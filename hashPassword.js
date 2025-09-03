// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// // 🔁 Replace this with your actual MongoDB connection string if different
// const MONGO_URI = "mongodb://localhost:27017/cakeshop";

// const ownerSchema = new mongoose.Schema({
//   email: String,
//   password: String,
// });

// const Owner = mongoose.model("Owner", ownerSchema);

// async function addOwner() {
//   try {
//     await mongoose.connect(MONGO_URI);

//     const email = "sakshigaikwad313@gmail.com";
//     const plainPassword = "Swapn1234";

//     // Check if the owner already exists
//     const existingOwner = await Owner.findOne({ email });
//     if (existingOwner) {
//       console.log("⚠️ Owner already exists in the database.");
//     } else {
//       // Hash the password and save the owner
//       const hashedPassword = await bcrypt.hash(plainPassword, 10);
//       const owner = new Owner({
//         email,
//         password: hashedPassword,
//       });

//       await owner.save();
//       console.log("✅ Owner saved successfully!");
//     }
//   } catch (error) {
//     console.error("❌ Error while saving owner:", error);
//   } finally {
//     await mongoose.disconnect();
//   }
// }

// addOwner();
// // postman token
// // {
// //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lcklkIjoiNjg4MmU0NWEzYmM2Y2U4NmQxMjZlYzNiIiwiaWF0IjoxNzUzNDA4Njg5LCJleHAiOjE3NTM0OTUwODl9.kjzNhrD-KPcOEDsuPn2EmSekLRX49ojYzJdPZ4ooTrY"
// // }

// hashPassword.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Owner = require("./models/Owner"); 
require("dotenv").config();

async function createOwner() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "sakshigaikwad313@gmail.com";
    const plainPassword = "Swapn1234";

    // Check if owner already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      console.log("⚠️ Owner already exists! Skipping creation.");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create new owner
    const newOwner = new Owner({
      email,
      password: hashedPassword,
    });

    await newOwner.save();
    console.log("✅ Owner created successfully!");
  } catch (err) {
    console.error("❌ Error creating owner:", err);
  } finally {
    mongoose.disconnect();
  }
}

createOwner();
