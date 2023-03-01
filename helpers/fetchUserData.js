const pool = require("../dataBase/sqlConnection");

const fetchUserData = async (req, res) => {
  const { first_name, last_name, role, email } = req.body;
  const personalData = req.body;
  try {
    if (role === "admin") {
      const data = await pool.query(
        `SELECT * from users where parent_email= $1`,
        [email]
      );
      const managerData = data.rows;
      let trainerData = [],
        traineeData = [];
      for (const i in managerData) {
        const trainer = await pool.query(
          `SELECT * from users where parent_email = $1`,
          [managerData[i].email]
        );
        trainerData = [...trainerData, ...trainer.rows];
      }
      for (const j in trainerData) {
        const trainee = await pool.query(
          `SELECT * from users where parent_email = $1`,
          [trainerData[j].email]
        );
        traineeData = [...traineeData, ...trainee.rows];
      }

      res.send({ personalData, managerData, trainerData, traineeData });
    } else if (role === "manager") {
      const data = await pool.query(
        `SELECT * from users where parent_email= $1`,
        [email]
      );
      const trainerData = data.rows;
      let allTraineeData = [];
      for (const i in trainerData) {
        const trainee = await pool.query(
          `SELECT * from users where parent_email = $1`,
          [trainerData[i].email]
        );

        // trainerData[i].trainee == trainee.rows;
        trainerData[i].trainee = [...trainee.rows];
        allTraineeData = [...allTraineeData, ...trainee.rows];
      }
      res.send({ personalData, trainerData, allTraineeData });
    } else if (role === "trainer") {
      const data = await pool.query(
        `SELECT * from users where parent_email= $1`,
        [email]
      );
      const traineeData = data.rows;

      res.send({ personalData, traineeData });}
     else if (role === "trainee") {
      let trainee,
        certificate,
        skill,
        project,
        projectSkill,
        jsonData,
        arr1 = [],
        arr2 = [];
      arr3 = [];
      arr4 = [];

      trainee = await pool.query(`SELECT * from trainee where email = $1`, [
        email,
      ]);

      certificate = await pool.query(
        `SELECT * from certificate where email = $1`,
        [email]
      );

      skill = await pool.query(`SELECT * from techstack where email = $1`, [
        email,
      ]);

      project = await pool.query(`SELECT * from project where email = $1`, [
        email,
      ]);

      for (let j in trainee.rows) {
        for (let i in skill.rows) {
          if (trainee.rows[j].email === skill.rows[i].email) {
            arr1 = [
              ...arr1,
              {
                skill: skill.rows[i].skills,
                rating: skill.rows[i].rating,
              },
            ];
          }
        }
        for (let k in certificate.rows) {
          
          if (trainee.rows[j].email === certificate.rows[k].email) {
            arr2 = [
              ...arr2,
              {
                name: certificate.rows[k].name,
                link: certificate.rows[k].link,
              },
            ];
          }
        }
        for (const l in project.rows) {
          if (trainee.rows[j].email === project.rows[l].email) {
            projectSkill = await pool.query(
              `SELECT * from projectskill where project_id = $1`,
              [project.rows[l].project_id]
            );
            for (const m in projectSkill.rows) {
              // if(projectSkill.rows[m].name === project.rows[l].name){
              arr4 = [...arr4, projectSkill.rows[m].skill];
              // }
              project.rows[l].skillAcquired = arr4;
            }
            arr3 = [...arr3, project.rows[l]];
          }
        }
        jsonData = {
          data: trainee.rows[j],
          skill: arr1,
          certificate: arr2,
          project: arr3,
        };
      }
      res.json(jsonData);
    }
  } catch (error) {
    res.send(error.message);
  }
};
module.exports = fetchUserData;
