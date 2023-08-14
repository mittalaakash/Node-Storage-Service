const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    bucketId: {
      type: Schema.Types.ObjectId,
      ref: 'Bucket',
    },
    name: String,
    size: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model('File', fileSchema);
