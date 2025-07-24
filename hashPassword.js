const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 🔁 Replace this with your actual MongoDB connection string if different
const MONGO_URI = "mongodb://localhost:27017/cakeshop";

const ownerSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Owner = mongoose.model("Owner", ownerSchema);

async function addOwner() {
  try {
    await mongoose.connect(MONGO_URI);

    const email = "satyavita81@gmail.com";
    const plainPassword = "Swapn1234";

    // Check if the owner already exists
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      console.log("⚠️ Owner already exists in the database.");
    } else {
      // Hash the password and save the owner
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const owner = new Owner({
        email,
        password: hashedPassword,
      });

      await owner.save();
      console.log("✅ Owner saved successfully!");
    }
  } catch (error) {
    console.error("❌ Error while saving owner:", error);
  } finally {
    await mongoose.disconnect();
  }
}

addOwner();
