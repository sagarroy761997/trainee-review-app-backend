const pool = require("./../dataBase/sqlConnection");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { first_name, last_name,parent_email, role, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(email, password, hashedPassword)
    pool.query(
      "INSERT INTO users (first_name, last_name,parent_email,role,email, password) VALUES ($1,$2,$3,$4,$5,$6)",
      [first_name,last_name,parent_email,role,email, hashedPassword],
      (error, results) => {
        if(error){
            res.send(error.message)
        }else{
          res.status(201).send(`User added `);
        }
      }
    );
  } catch {
    res.status(500).send();
  }
};

module.exports = signup;