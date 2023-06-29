require("dotenv").config();
const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// database connection setup
const db = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  database: process.env.DB,
  user: process.env.USERNAME,
  password: process.env.PSWD,
});

// connection to the database
db.connect((err)=>{
  if(err) throw err;
  console.log("DB connection successful");
})

// Login endpoint
app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const query = 'select * from users where email="${email}" and pswd="${password}"';
  
  db.query(query, (err, result) => {
    if (err) throw err;

    if(result.length === 1){
      res.json({success: true, message: "Login successful"});
    } else {
      res.json({success: false, message: "Login unsuccessful"});
    }

  })
})

app.listen(port, () => {
  console.log(`server is listening to ${port}`);
})
