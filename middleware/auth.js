const userModel = require('../model/UserModel');

exports.authMiddleware = async (req, res, next) => {
  try {
    console.log(req.headers);
    const apiKey = req.headers?.['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }
    const user = await userModel.findOne({
      apiKey,
    });
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};
