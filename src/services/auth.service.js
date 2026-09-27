const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

function generateToken(userId) {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'secret_key_default', 
    {
      // Fallback ke '1d' (1 hari) jika JWT_EXPIRES_IN tidak terbaca
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    }
  );
}

async function register({ name, email, password, role }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email sudah terdaftar', 409);
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  // Sembunyikan password dari response agar aman
  user.password = undefined;

  return { user, token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Email atau password salah', 401);
  }

  const token = generateToken(user._id);

  // Sembunyikan password dari response agar aman
  user.password = undefined;

  return { user, token };
}

module.exports = { register, login };