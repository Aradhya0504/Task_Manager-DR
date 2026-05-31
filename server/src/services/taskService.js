const Task = require('../models/Task');

const getAllTasks = (userId) => {
  return Task.find({ userId }).sort({ createdAt: -1 });
};

const createTask = (userId, data) => {
  return Task.create({ ...data, userId });
};

const updateTask = async (taskId, userId, data) => {
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }

  Object.assign(task, data);
  return task.save();
};

const deleteTask = async (taskId, userId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  return task;
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
