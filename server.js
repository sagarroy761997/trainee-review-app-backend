const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4999;
const cookieParser = require("cookie-parser");
const login = require("./helpers/login")
const signup = require("./helpers/signup")
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

app.get("/", (req, res)=> {
    res.send('Hello world')
});
app.post("/signup",signup)
app.post("/login",login);
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
