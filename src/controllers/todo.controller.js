const todoService = require('../services/todo.service');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const getTodos = catchAsync(async (req, res, next) => {
  const result = await todoService.getTodos(req.user.id, req.query);
  res.status(200).json({
    success: true,
    data: result.todos,
    pagination: result.pagination
  });
});

const createTodo = catchAsync(async (req, res, next) => {
  const todo = await todoService.createTodo(req.user.id, req.body);
  res.status(201).json({
    success: true,
    data: todo
  });
});

const getTodoById = catchAsync(async (req, res, next) => {
  const todo = await todoService.getTodoById(req.user.id, req.params.id);
  if (!todo) {
    return next(new AppError('Todo tidak ditemukan', 404));
  }
  res.status(200).json({
    success: true,
    data: todo
  });
});

const updateTodo = catchAsync(async (req, res, next) => {
  const todo = await todoService.updateTodo(req.user.id, req.params.id, req.body);
  if (!todo) {
    return next(new AppError('Todo tidak ditemukan', 404));
  }
  res.status(200).json({
    success: true,
    data: todo
  });
});

const deleteTodo = catchAsync(async (req, res, next) => {
  const todo = await todoService.deleteTodo(req.user.id, req.params.id);
  if (!todo) {
    return next(new AppError('Todo tidak ditemukan', 404));
  }
  res.status(200).json({
    success: true,
    message: 'Todo berhasil dihapus'
  });
});

module.exports = {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo
};