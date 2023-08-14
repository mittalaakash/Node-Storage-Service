const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../config.env' });

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(error => {
    console.log('Connection error:', error);
  });
