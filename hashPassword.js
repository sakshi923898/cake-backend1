
const bcrypt = require("bcryptjs");

async function hashPassword(plainPassword) {
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log("Hashed Password:", hashed);
}

hashPassword("Swapn1234"); // Replace with your real password
// Hashed Password: $2b$10$GCcouQpmraQWPL/UV1HGdeJuNaJ67s11w9XNHnPGYNRxGinKrnMAa