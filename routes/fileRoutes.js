const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/fileHandler');
const router = require('express').Router();

router.use(authMiddleware);
router
  .post('/', async (req, res) => {
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
  .get('/', async (req, res) => {
    try {
      const bucketContent = fs.readdirSync('./buckets');
      const buckets = bucketContent.filter(
        file => !fs.statSync(`./buckets/${file}`).isFile(),
      );
      return res.status(200).json({
        message: 'Buckets fetched',
        data: buckets,
      });
    } catch (error) {
      console.log(error);
    }
  });

router
  .post('/:bucketName', upload().single('file'), (req, res) => {
    if (req.file) {
      return res.status(201).json({
        status: true,
        message: 'File uploaded successfully',
        data: req.file,
      });
    }
    return res.status(400).json({
      status: false,
      message: 'File not uploaded',
    });
  })
  .get('/:bucketName', async (req, res) => {
    const { bucketName } = req.params;
    if (!bucketName) {
      return res.json({
        status: false,
        message: 'Please provide a bucketName',
      });
    }
    const bucketPath = `./buckets/${bucketName.trim()}`;
    if (fs.existsSync(bucketPath)) {
      const files = fs.readdirSync(bucketPath);
      if (files?.length) {
        return res.json({
          status: true,
          data: files,
        });
      }
    }
    return res.status(204).json({ status: false, message: 'no data found!!' });
  });

module.exports = router;
