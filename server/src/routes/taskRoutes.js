const express = require('express');
const router = express.Router();
const { getTasks, addTask, editTask, removeTask } = require('../controllers/taskController');
const { authenticate } = require('../middleware/authenticate');

// All task routes require a valid JWT
router.use(authenticate);

router.get('/', getTasks);
router.post('/', addTask);
router.patch('/:id', editTask);
router.delete('/:id', removeTask);

module.exports = router;
