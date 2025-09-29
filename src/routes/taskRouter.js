const express = require('express');
const router = express.Router();
const Task = require('../models/taskModel');
const { userAuth } = require('../middlewares/auth');

// Create a new task
router.post('/', userAuth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            createdBy: req.user._id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all tasks for the authenticated user
router.get('/', userAuth, async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a single task by ID
router.get('/:id', userAuth, async (req, res) => {
    try {
        const task = await Task.findOne({ 
            _id: req.params.id, 
            createdBy: req.user._id 
        });
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a task
router.patch('/:id', userAuth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'completed', 'dueDate', 'priority'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a task
router.delete('/:id', userAuth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ 
            _id: req.params.id, 
            createdBy: req.user._id 
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
