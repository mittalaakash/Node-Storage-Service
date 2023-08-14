const Bucket = require('../Model/BucketModel');

const AppError = require('../Utils/AppError');
const catchAsync = require('../Utils/CatchAsync');

const checkBucketAccess = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const urlParts = req.originalUrl.split('/');
  const bucketName = urlParts[2];

  // Query the database to check if the user has access to the bucket
  const userBucket = await Bucket.findOne({ user: userId, name: bucketName });

  if (!userBucket) {
    next(
      new AppError(
        'The user does not have access to the specified bucket',
        403,
      ),
    );
  }

  // If the user has access, proceed to the next middleware/route handler
  next();
});

module.exports = checkBucketAccess;
