const pool = require("../dataBase/sqlConnection");

const traineeReport = async (req, res) => {
  const { email } = req.body;

  try {
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
              certificate: certificate.rows[k].certificate,
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
            project.rows[l].skill = arr4;
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
  } catch (error) {
    res.send(error.message);
  }
};
module.exports = traineeReport;
