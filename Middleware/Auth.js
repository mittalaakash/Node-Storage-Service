const User = require('../Model/UserModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const AppError = require('../Utils/AppError');
const catchAsync = require('../Utils/CatchAsync');

exports.authMiddleware = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in first to access', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError('The user belonging to this token no longer exists', 401),
    );
  }

  req.user = user;

  next();
});
