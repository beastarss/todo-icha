const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.register = catchAsync(async (req, res, next) => {
  // Ambil 'name' atau 'nama' dari request body
  const name = req.body.name || req.body.nama;
  const { email, password, role } = req.body;

  // Cek apakah data lengkap
  if (!name || !email || !password) {
    return next(new AppError('Nama, email, dan password wajib diisi', 400));
  }

  // Kirim data ke service
  const { user, token } = await authService.register({ name, email, password, role });

  res.status(201).json({
    status: 'success',
    message: 'Registrasi berhasil',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email dan password wajib diisi', 400));
  }

  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    status: 'success',
    message: 'Login berhasil',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});