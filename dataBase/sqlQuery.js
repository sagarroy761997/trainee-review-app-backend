const pool = require("./sqlConnection");
const bcrypt = require("bcrypt");
const fetchUsers = (request, response) => {
  // let fetchedUserData;
  const { role, email } = request.body;
  if (role === "admin") {
    pool.query(
      `SELECT * FROM users where role not in ($1) `,
      [role],
      (error, results) => {
        if (error) {
          response.send(error.message);
        }
        response.send(results.rows);
      }
    );
  } else if (role === "manager") {
    pool.query(
      `SELECT * FROM users where parent_email = $1 `,
      [email],
      (error, results) => {
        if (error) {
          response.send(error.message);
        }
        // response.send(results.rows);
        const trainerData = results.rows;
        // response.send(trainerData);
        const trainerEmail = trainerData.map((element) => element.email);
        
        // response.send(trainerEmail);
        const params =[]
        for(var i = 1; i <= trainerEmail.length; i++) {
          params.push('$' + i);
        }
        var queryText = 'SELECT * FROM users WHERE parent_email IN (' + params.join(',') + ')';
        pool.query(queryText, trainerEmail, (error,results)=>{
          if(error){
            response.send(error.message)
          }
          response.send(results.rows)
        });
        
      }
    );
  }

  
   else if (role === "trainer") {
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
  const { first_name, last_name, password, role, parent_email } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  pool.query(
    "UPDATE users SET first_name = $1, last_name = $2, password = $3, role = $4, parent_email = $5 WHERE email = $6",
    [first_name, last_name, hashedPassword, role, parent_email, email],
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
        response.json(error.message);
      }
      response.json(`user with email ${email} is deleted`);
      // response.send(request)
    }
  );
};


module.exports = {
  fetchUsers,
  updateUser,
  deleteUser,
};
