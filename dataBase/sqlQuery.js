const pool = require("./sqlConnection");
const bcrypt = require("bcrypt");
const fetchUsers = (request, response) => {
  const { role,email } = request.body;
  if (role === "admin") {
    pool.query(
      `SELECT * FROM users where role not in ($1)`,
      [role],
      (error, results) => {
        if (error) {
          response.send(error.message);
        }
        const managerData= results.rows.filter((element)=>{element.role === 'manager'})
        const trainerData= results.rows.filter((element)=>{element.role === 'trainer'})
        const traineeData= results.rows.filter((element)=>{element.role === 'trainee'})
        response.status(200).send({managerData,trainerData,traineeData});
      }
    );
  } else if (role === "manager") {
    pool.query(
      `SELECT * FROM users where role not in ($1,$2)`,
      [`manager`, `admin`],
      (error, results) => {
        if (error) {
          response.send(error.message);
        }
        const trainerData = results.rows.filter((element)=>{element.role === 'trainer' && element.parent_email === email})
        const trainer
        const traineeData = results.rows.filter((element) => {element.role == 'trainee' && })
        response.status(200).send(results.rows);
      }
    );
  } else if (role === "trainer") {
    pool.query(
      `SELECT * FROM users where role = $1 and parent_email = $2`,
      [`trainee`, email],
      (error, results) => {
        if (error) {
          response.send(error.message);
        }
        response.status(200).send(results.rows);
      }
    );
  }
};

const updateUser = async (request, response) => {
  const email = request.params.email;
  const { first_name, last_name, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  pool.query(
    "UPDATE users SET first_name = $1, last_name = $2, password = $3 WHERE email = $4",
    [first_name, last_name, hashedPassword, email],
    (error) => {
      if (error) {
        response.send(error.message);
      }
      response.send(`User modified`);
    }
  );
};
const deleteUser = (request, response) => {
  const email = request.params.email;
  console.log(request.body);
  pool.query(
    `delete from users where email= $1 `,
    [email],
    (error, results) => {
      if (error) {
        response.send(error.message);
      }
      response.send(`user with email ${email} is deleted`);
      // response.send(request)
    }
  );
};

module.exports = {
  fetchUsers,
  updateUser,
  deleteUser,
};
