const pool = require("./../dataBase/sqlConnection");
const bcrypt = require("bcrypt");

const hashing = async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    res.send(hashedPassword)
  } catch {
    res.status(500).send();
  }
};

module.exports = hashing;