const mongoose = require('mongoose');
const { Schema } = mongoose;

const bucketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'bucketName is required'],
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Bucket', bucketSchema);
