const pool = require("./../dataBase/sqlConnection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const login = async (req, res) => {
  pool.query("SELECT * FROM users", async (error, results) => {
    let user;
    if (error) {
      res.send(error.message);
    } else {
      user = results.rows.find((element) => element.email === req.body.email);
    }
    if (user == null) {
      return res
        .status(400)
        .send("email is not correct or the user is not signed up!");
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign(
          user,
          process.env.ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: "1m" }
        );
        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.send(user);
      } else {
        res.send("password is wrong");
      }
    } catch {
      res.status(500).send("error");
    }
  });
};

module.exports = login;
