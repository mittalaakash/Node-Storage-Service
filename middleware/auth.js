const userModel = require('../Model/UserModel');
const users = require('../data/users.json');

exports.authMiddleware = async (req, res, next) => {
  const apiKey = req.headers?.['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
  const user = users.some(user => user.apiKey === apiKey);
  if (!user) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  req.user = user;
  next();
};
