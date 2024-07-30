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
      { id: newUser._id },
      'itsuptoyoutoUnlockitdontcare',
      { expiresIn: '90d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'user regitered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(new createError('User not found', 404));
    const isPasswordvalid = await bcrypt.compare(password, user.password);

    if (!isPasswordvalid)
      return next(new createError('Incorect password', 401));

    const token = jwt.sign({ id: User._id }, 'itsuptoyoutoUnlockitdontcare', {
      expiresIn: '90d',
    });

    res.status(200).json({
      status: 'success',
      token,
      message: 'Logged in successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
