const router = require('express').Router();

const { authMiddleware } = require('../Middleware/Auth');
const { upload } = require('../Middleware/FileHandler.js');
const fileController = require('../Controllers/FileController.js');

router.use(authMiddleware);

//get all buckets
router.get('/', fileController.getAllBuckets);

//upload file to bucket
router
  .post(
    '/:bucketName',
    upload().single('file'),
    fileController.uploadFileToBucket,
  )
  //get files from bucket
  .get('/:bucketName', fileController.getFilesFromBucket);

//download file from bucket
router
  .get('/:bucketName/:fileName', fileController.downloadFile)
  //delete file from bucket
  .delete('/:bucketName/:fileName', fileController.deleteFile);

module.exports = router;
