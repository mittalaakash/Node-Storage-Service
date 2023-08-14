const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');

const Bucket = require('../Model/BucketModel');
const { pathCheck } = require('../Utils/PathCheck');

exports.upload = () => {
  return (imageUpload = multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        const bucketName = req.params.bucketName.trim();
        const userId = req.user.id;
        const dir = `./Buckets/${bucketName}`;

        const existingBucket = await Bucket.findOne({ name: bucketName });
        if (existingBucket) {
          if (!existingBucket?.user.equals(userId)) {
            cb(null, 'Bucket name already exists for another user');
          }
        } else {
          let pathExists = await pathCheck(dir);

          if (!pathExists) {
            await fs.mkdir(dir, { recursive: true });

            const newBucket = new Bucket({
              name: bucketName,
              user: userId,
            });
            await newBucket.save();
          }
        }
        cb(null, dir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 50,
    },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    },
  }));
};
