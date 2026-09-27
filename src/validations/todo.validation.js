const { body, query } = require('express-validator');

const createTodoValidation = [
  body('title')
    .notEmpty()
    .withMessage('Judul todo wajib diisi')
    .isString()
    .withMessage('Judul todo harus berupa teks')
    .trim()
];

const getTodosValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Halaman (page) harus berupa angka minimal 1'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Batasan (limit) harus berupa angka minimal 1')
];

module.exports = {
  createTodoValidation,
  getTodosValidation
};