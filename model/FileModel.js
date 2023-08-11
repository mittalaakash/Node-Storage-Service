const db = require('../config/db');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const userModel = require('./UserModel');

const fileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: userModel.modelName,
    },
    fileName: String,
    mimeType: String,
    path: String,
  },
  { timestamps: true },
);

const fileModel = db.model('files', fileSchema);
module.exports = fileModel;
