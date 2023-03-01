const pool = require("./../dataBase/sqlConnection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query(`SELECT * from users`);
    const user = users.rows.find((element) => element.email === email);
    if (user == null) {
      res.send("email is wrong or contact admin/manager");
    } else {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign(
          user,
          process.env.ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: "30m" }
        );
        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.send(user)
      } else {
        res.send("password is wrong");
      }
    }
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = login;
