const fs = require('fs');
const path = require('path');
const multer = require('multer');

exports.upload = () => {
  return (imageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const bucketName = req.params.bucketName;

        const dir = `./buckets/${bucketName}`;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      },
    }),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, Date.now());
    },
    limits: {
      fileSize: 1024 * 1024 * 50,
    },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    },
  }));
};
