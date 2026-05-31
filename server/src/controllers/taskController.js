const Joi = require('joi');
const { getAllTasks, createTask, updateTask, deleteTask } = require('../services/taskService');

const createSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(500).allow('').optional(),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().allow(null).optional(),
});

const updateSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  description: Joi.string().max(500).allow('').optional(),
  status: Joi.string().valid('todo', 'in-progress', 'done').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().allow(null).optional(),
}).min(1);

const getTasks = async (req, res, next) => {
  try {
    const tasks = await getAllTasks(req.userId);
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

const addTask = async (req, res, next) => {
  try {
    const { error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const task = await createTask(req.userId, req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const editTask = async (req, res, next) => {
  try {
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const task = await updateTask(req.params.id, req.userId, req.body);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

const removeTask = async (req, res, next) => {
  try {
    await deleteTask(req.params.id, req.userId);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, addTask, editTask, removeTask };
