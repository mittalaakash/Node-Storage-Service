const db = require('../config/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    apiKey: String,
  },
  { timestamps: true },
);

const userModel = db.model('user', userSchema);
module.exports = userModel;
