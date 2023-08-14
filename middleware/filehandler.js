const fs = require('fs/promises');
const path = require('path');
const multer = require('multer');
const { pathCheck } = require('../Utils/PathCheck');

exports.upload = () => {
  return (imageUpload = multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        const bucketName = req.params.bucketName;
        const dir = `./Buckets/${bucketName}`;

        let pathExists = await pathCheck(dir);

        if (!pathExists) {
          await fs.mkdir(dir, { recursive: true });
        }

        cb(null, dir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
    limits: {
      fileSize: 1024,
    },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    },
  }));
};
