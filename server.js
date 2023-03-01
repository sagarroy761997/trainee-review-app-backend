const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4999;
const cookieParser = require("cookie-parser");
const login = require("./helpers/login");
const signup = require("./helpers/signup");
const authMiddleware = require("./helpers/authMiddleware")
const { fetchUsers, updateUser, deleteUser } = require("./dataBase/sqlQuery");
const hashing = require("./helpers/hashing");
const traineeReport = require("./helpers/traineeData");
const fetchUserData = require("./helpers/fetchUserData")
const report = require("./helpers/traineeReport")
const logout = require("./helpers/logout")

const addCertificate = require("./helpers/traineeData")
require("dotenv").config();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    extended: true,
  })
);

// app.get("/", (req, res)=> {
//     res.send('Hello world')
// });
app.post("/hashing", hashing)
app.post("/signup", signup);
app.post("/login", login);
app.delete("/deleteUser/:email",authMiddleware, deleteUser);
app.put("/updateUser/:email",authMiddleware, updateUser);
// app.get('/users', traineeReport.users)
app.post("/trainee",authMiddleware, traineeReport.traineeQuery)
app.post("/certificate",authMiddleware, traineeReport.certificateQuery)
app.post("/addCertificate" ,authMiddleware, traineeReport.addCertificate)
app.post("/skills",authMiddleware, traineeReport.skills)
app.post('/projectSkill',authMiddleware, traineeReport.projectSkill)
app.post("/project",authMiddleware, traineeReport.project)
app.post("/fetchUserData",authMiddleware, fetchUserData);
app.post("/under",authMiddleware, traineeReport.under );
app.post("/logout", logout )
// app.post("/traineeReport", report);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
