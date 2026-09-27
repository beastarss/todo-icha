const AppError = require('../utils/AppError');

const apiKeyMiddleware = (req, res, next) => {
  // 1. Bebaskan rute auth & swagger dari pemeriksaan API Key
  if (req.originalUrl.startsWith('/api/auth') || req.originalUrl.startsWith('/api-docs')) {
    return next();
  }

  // 2. Jika di mode development, bypass pemeriksaan API Key
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  // 3. Jika di mode production, periksa header x-api-key
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(new AppError('API Key tidak ditemukan. Kirimkan header x-api-key', 401));
  }

  const validApiKey = process.env.EXTERNAL_API_KEY || process.env.API_KEY;

  if (apiKey !== validApiKey) {
    return next(new AppError('API Key tidak valid', 403));
  }

  next();
};

module.exports = apiKeyMiddleware;