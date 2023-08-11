const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/fileHandler');
const router = require('express').Router();

router
  .post('/', authMiddleware, async (req, res) => {
    try {
      const { bucketName } = req.body;
      if (!bucketName.trim()) {
        return res.status(400).json({
          message: 'Bucket name is required',
        });
      }
      const bucketPath = `./buckets/${bucketName.trim()}`;
      if (!fs.existsSync(bucketPath)) {
        fs.mkdirSync(bucketPath);
        return res.status(201).json({
          message: 'Bucket created',
        });
      } else {
        return res.status(400).json({
          message: 'Bucket already exists',
        });
      }
    } catch (error) {
      console.log(error);
    }
  })
  .get('/', authMiddleware, async (req, res) => {
    try {
      const buckets = fs.readdirSync('./buckets');
      return res.status(200).json({
        message: 'Buckets fetched',
        data: buckets,
      });
    } catch (error) {
      console.log(error);
    }
  });

router.post(
  '/:bucketName',
  authMiddleware,
  upload().single('file'),
  async (req, res) => {
    if (req.file) {
      return res.status(201).json({
        message: 'File uploaded successfully',
        data: req.file,
      });
    }
    return res.status(400).json({
      message: 'File not uploaded',
    });
  },
);

module.exports = router;
