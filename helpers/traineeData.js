const pool = require("./../dataBase/sqlConnection");
const traineeQuery = (request, response) => {
  const { email } = request.body;
  pool.query(
    `SELECT * from trainee where email = $1`,
    [email],
    (error, results) => {
      if (error) {
        error.message;
      }
      response.json(results.rows);
    }
  );
};
const certificateQuery = (req, res) => {
  const { email, name, link } = req.body;
  pool.query(
    `SELECT * from certificate where email = $1`,
    [email],
    (error, results) => {
      if (error) {
        error.message;
      }
      res.json(results.rows);
    }
  );
  
};
const under = (req,res) => {
  const { email, name, link } = req.body;
  pool.query(
    "select * from users where parent_email= $1",
      [email],
      (error, results) => {
        if(error){
            res.send(error.message)
        }else{
          res.status(201).send(results.rows);
        }
      })
}
const addCertificate = (req,res) => {
  const { email, name, link } = req.body;
  pool.query(
    "INSERT INTO certificate (name, email, link) VALUES ($1,$2,$3)",
      [name, email, link],
      (error, results) => {
        if(error){
            res.send(error.message)
        }else{
          res.status(201).send(`User added `);
        }
      })
}
const project = (request, response) => {
  const { email } = request.body;
  pool.query(
    `SELECT * from project where email = $1`,
    [email],
    (error, results) => {
      if (error) {
        error.message;
      }
      response.json(results.rows);
    }
  );
};

const skills = (request, response) => {
  const { email } = request.body;
  pool.query(
    `SELECT * from techstack where email = $1`,
    [email],
    (error, results) => {
      if (error) {
        error.message;
      }
      response.json(results.rows);
    }
  );
};

const projectSkill = (request,response) => {
  const { email } = request.body;
  pool.query('select * from projectskill where project_id in (select project_id from project where email = $1)',[email],(error, results) => {
    if (error) {
      error.message;
    }
    response.json(results.rows);
  })
}

const users = (request, response) => {
  pool.query(
    `SELECT * from users where role != admin`,
    (error, results) => {
      if (error) {
        error.message;
      }
      response.json(results.rows);
    }
  );
};


module.exports = {
  traineeQuery,
  certificateQuery,
  skills,
  project,
  projectSkill,
  addCertificate,
  under,
  users,
};
