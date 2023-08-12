const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require('../middleware/fileHandler');
const router = require('express').Router();

router.use(authMiddleware);

//get all buckets
router.get('/', async (req, res) => {
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

//upload file to bucket
//get files from bucket
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
        const filesOnly = files.filter(file =>
          fs.statSync(`${bucketPath}/${file}`).isFile(),
        );
        return res.json({
          status: true,
          data: filesOnly,
        });
      }
    }
    return res.status(204).json({ status: true, message: 'no data found!!' });
  });

//download file from bucket
router.get('/:bucketName/:fileName', async (req, res) => {
  const { bucketName, fileName } = req.params;
  if (!bucketName.trim() || !fileName.trim()) {
    return res.json({
      status: false,
      message: 'Please provide a bucketName and fileName',
    });
  }

  const bucketPath = `./buckets/${bucketName.trim()}`;
  if (fs.existsSync(bucketPath + '/' + fileName.trim())) {
    const files = fs.readdirSync(bucketPath);
    if (files?.length) {
      const file = files.find(file => file === fileName.trim());
      if (file) {
        res.setHeader('Content-Disposition', 'attachment; filename=' + file);
        const fileStream = fs.createReadStream(`${bucketPath}/${file}`);
        return fileStream.pipe(res);
      }
    }
  }
  return res.json({ status: true, message: 'no data found!!' });
});

//delete file from bucket
router.delete('/:bucketName/:fileName', async (req, res) => {
  const { bucketName, fileName } = req.params;
  if (!bucketName.trim() || !fileName.trim()) {
    return res.json({
      status: false,
      message: 'Please provide a bucketName and fileName',
    });
  }

  const bucketPath = `./buckets/${bucketName.trim()}`;

  fs.existsSync(bucketPath + '/' + fileName.trim()) &&
    fs.unlinkSync(bucketPath + '/' + fileName.trim());

  return res.json({ status: true, message: 'File deleted successfully!!' });
});

module.exports = router;
