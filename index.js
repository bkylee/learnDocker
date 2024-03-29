import pg from "pg";
import express from "express";
import bodyParser from "body-parser";

//establish connection with PSQL DB using node-postgres

const { Client } = pg;

const client = new Client({
  user: "postgres",
  host: "db",
  dadtabase: "postgres",
  password: "1234",
  port: 5432,
});
client.connect();

//create users table

const createTable = async () => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users 
    (
        id serial PRIMARY KEY,
        name VARCHAR (255) UNIQUE NOT NULL, 
        email VARCHAR (255) UNIQUE NOT NULL, 
        age INT NOT NULL
    );
    `);
};

//use Express and the middlware to parse the POST method

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api", (req, res) => res.send("Hello"));

//GET method to retrieve all users from the users table

app.get("/api/all", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM users`);

    if (response) {
      res.status(200).send(response.rows);
    }
  } catch (error) {
    res.status(500).send("No users found");
    console.log(error);
  }
});

//POST method for adding users to table

app.post("/api/form", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const age = req.body.age;

    const response = await client.query(
      `INSERT INTO users(name, email, age) VALUE ('${name}', '${email}', '${age}');`
    );
    if (response) {
      res.status(200).send(req.body);
    }
  } catch (error) {
    res.status(500).send("Error");
    console.log(error);
  }
});

//add port that will expose the API when server is running
app.listen(3000, () => console.log(`App is running on port 3000.`));
