const path = require('path');
const express = require('express');
const mySQL = require('mySQL');
const inquirer = require('inquirer');


const app = express();
const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
    console.log('Server listening on: http://localhost:' + PORT);
  });  