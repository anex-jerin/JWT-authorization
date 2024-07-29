const User = require('../models/userModel');
const createError = require('../utils/appErrors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER USER
exports.signUp = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(
        new createError('User with similar email already exist', 400)
      );
    }

    const hashPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({ ...req.body, password: hashPassword });

    const token = jwt.sign(
      { id: newUser.__id },
      'itsuptoyoutoUnlockitdontcare',
      { expiresIn: '90d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'user regitered successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};
exports.login = async () => {};
