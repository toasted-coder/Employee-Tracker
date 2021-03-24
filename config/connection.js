// DEPENDENCIES
const mysql = require('mysql');
require('dotenv').config();

// CREATING CONNECTION OBJECT
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3003,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// EXPORTING
module.exports = connection;