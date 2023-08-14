const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../Model/UserModel');
const CatchAsync = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  //remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

router.post(
  '/register',
  CatchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    const newUser = await User.create({
      name,
      email,
      password,
    });

    createSendToken(newUser, 201, req, res);
  }),
);

router.post(
  '/login',
  CatchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email.trim() || !password.trim()) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // check if credentials are correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('Incorrect email or password', 401));

    // if ok, send token
    createSendToken(user, 200, req, res);
  }),
);

module.exports = router;
