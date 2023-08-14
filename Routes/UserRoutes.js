const router = require('express').Router();
const userModel = require('../model/UserModel');
const crypto = require('crypto-js');

router.post('/register', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name.trim()) {
      return res.status(400).json({
        message: 'Name is required',
      });
    }
    var key = name + Date.now();
    const apiKey = crypto.SHA256(key).toString().slice(0, 20);
    const userCreated = await userModel.create({
      name,
      apiKey,
    });

    return res.status(201).json({
      message: 'User created',
      data: userCreated,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
