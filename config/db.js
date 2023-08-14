const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../config.env' });

const conn = mongoose
  .createConnection(process.env.DATABASE_URL)
  .on('open', () => {
    console.log('Connected to database!');
  })
  .on('error', error => {
    console.log('Connection error:', error);
  });

module.exports = conn;
