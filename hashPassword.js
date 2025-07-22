
const bcrypt = require("bcryptjs");

async function hashPassword(plainPassword) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log("Hashed Password:", hashed);
}

hashPassword("Swapn123"); // Replace with your real password
// Hashed Password: $2b$10$FDXwAQ00FXbnAgMqVrle3.23cA8Cy8uK1txa3HvmcpWUIOzVeDAH2