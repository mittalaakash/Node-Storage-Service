const fs = require('fs');
const path = require('path');
const multer = require('multer');

exports.upload = () => {
  return (imageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const bucketName = req.params.bucketName;
        console.log({ file });

        const dir = `./buckets/${bucketName}`;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
      cb(null, true);
    },
  }));
};
