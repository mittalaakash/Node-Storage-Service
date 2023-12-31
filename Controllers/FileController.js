const fs = require('fs/promises');
fs.createReadStream = require('fs').createReadStream;
const Bucket = require('../Model/BucketModel');

const catchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');
const { pathCheck } = require('../Utils/PathCheck');

exports.getAllBuckets = catchAsync(async (req, res) => {
  // const bucketContent = await fs.readdir('./Buckets');

  // const buckets = await Promise.all(
  //   bucketContent.map(async bucket => {
  //     const stats = await fs.stat(`./Buckets/${bucket}`);
  //     return stats.isDirectory() ? bucket : null;
  //   }),
  // );
  // const bucketNames = buckets.filter(bucket => bucket !== null);

  const userId = req.user.id;

  const userBuckets = await Bucket.find({ user: userId });

  const bucketNames = userBuckets.map(bucket => bucket.name);

  return res.status(200).json({
    message: 'Buckets fetched',
    data: bucketNames,
  });
});

exports.uploadFileToBucket = catchAsync(async (req, res, next) => {
  if (req.file) {
    return res.status(201).json({
      status: true,
      message: 'File uploaded successfully',
      data: req.file,
    });
  }
  return next(new AppError('File not uploaded', 404));
});

exports.getFilesFromBucket = catchAsync(async (req, res, next) => {
  const { bucketName } = req.params;

  if (!bucketName.trim()) {
    return next(new AppError('Please provide a bucketName', 404));
  }

  const bucketPath = `./Buckets/${bucketName.trim()}`;
  let pathExists = await pathCheck(bucketPath);

  if (pathExists) {
    const files = await fs.readdir(bucketPath);
    if (files?.length) {
      const filesOnly = await Promise.all(
        files.map(async file => {
          const stats = await fs.stat(`${bucketPath}/${file}`);
          return stats.isFile() ? file : null;
        }),
      );
      const filteredFiles = filesOnly.filter(file => file !== null);

      return res.json({
        status: true,
        data: filteredFiles,
      });
    }
  }

  return res.json({ status: true, message: 'no data found!!' });
});

exports.downloadFile = catchAsync(async (req, res, next) => {
  const { bucketName, fileName } = req.params;
  if (!bucketName.trim() || !fileName.trim()) {
    return next(new AppError('Please provide a bucketName and fileName', 404));
  }

  const bucketPath = `./Buckets/${bucketName.trim()}`;
  const filePath = bucketPath + '/' + fileName.trim();
  let pathExists = await pathCheck(bucketPath);

  if (pathExists) {
    const files = await fs.readdir(bucketPath);
    if (files?.length) {
      const file = files.find(file => file === fileName.trim());
      if (file) {
        res.setHeader('Content-Disposition', 'attachment; filename=' + file);
        const fileStream = fs.createReadStream(filePath);
        return fileStream.pipe(res);
      }
    }
  }
  return res.json({ status: true, message: 'no data found!!' });
});

exports.deleteFile = catchAsync(async (req, res, next) => {
  const { bucketName, fileName } = req.params;
  if (!bucketName.trim() || !fileName.trim()) {
    return next(new AppError('Please provide a bucketName and fileName', 404));
  }

  const bucketPath = `./Buckets/${bucketName.trim()}`;
  const filePath = bucketPath + '/' + fileName.trim();

  let pathExists = await pathCheck(bucketPath);

  if (!pathExists) {
    return res.json({ status: true, message: 'File not found' });
  }

  await fs.unlink(filePath);
  return res.json({ status: true, message: 'File deleted successfully!!' });
});
