const Todo = require('../models/todo.model');

const getTodos = async (userId, query) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const totalItems = await Todo.countDocuments({ user: userId });
  const totalPages = Math.ceil(totalItems / limit);

  const todos = await Todo.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    todos,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      limit
    }
  };
};

const createTodo = async (userId, todoData) => {
  const todo = await Todo.create({
    ...todoData,
    user: userId
  });
  return todo;
};

const getTodoById = async (userId, todoId) => {
  const todo = await Todo.findOne({ _id: todoId, user: userId });
  return todo;
};

const updateTodo = async (userId, todoId, updateData) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: todoId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );
  return todo;
};

const deleteTodo = async (userId, todoId) => {
  const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
  return todo;
};

module.exports = {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo
};