const express = require('express');
const { validateTask } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Mock tasks database
const tasks = [];

// Get all tasks for a project
router.get('/project/:projectId', authenticateToken, (req, res) => {
  const projectTasks = tasks.filter(t => t.projectId === parseInt(req.params.projectId));
  
  // Build hierarchical structure
  const buildTaskTree = (parentId = null) => {
    return projectTasks
      .filter(task => task.parentId === parentId)
      .map(task => ({
        ...task,
        children: buildTaskTree(task.id)
      }));
  };
  
  const taskTree = buildTaskTree();
  res.json(taskTree);
});

// Create new task
router.post('/', authenticateToken, validateTask, (req, res) => {
  const { title, description, projectId, parentId, startDate, endDate, priority } = req.body;
  
  const task = {
    id: tasks.length + 1,
    title,
    description,
    projectId,
    parentId: parentId || null,
    startDate,
    endDate,
    priority: priority || 'medium',
    status: 'todo',
    progress: 0,
    assigneeId: req.user.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Validate schedule dependencies
  if (parentId) {
    const parentTask = tasks.find(t => t.id === parentId);
    if (parentTask && new Date(startDate) < new Date(parentTask.startDate)) {
      return res.status(400).json({ 
        error: 'Child task cannot start before parent task' 
      });
    }
  }
  
  tasks.push(task);
  
  res.status(201).json({
    message: 'Task created successfully',
    task
  });
});

// Update task with automatic schedule adjustment
router.put('/:id', authenticateToken, validateTask, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const oldTask = tasks[taskIndex];
  const updatedTask = {
    ...oldTask,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  // Automatic schedule adjustment logic
  const adjustments = [];
  if (req.body.startDate && req.body.startDate !== oldTask.startDate) {
    const dateDiff = new Date(req.body.startDate) - new Date(oldTask.startDate);
    
    // Adjust child tasks
    tasks.forEach((task, index) => {
      if (task.parentId === updatedTask.id) {
        const newStartDate = new Date(new Date(task.startDate).getTime() + dateDiff);
        const newEndDate = new Date(new Date(task.endDate).getTime() + dateDiff);
        
        tasks[index].startDate = newStartDate.toISOString();
        tasks[index].endDate = newEndDate.toISOString();
        tasks[index].updatedAt = new Date().toISOString();
        
        adjustments.push({
          taskId: task.id,
          taskTitle: task.title,
          oldStartDate: task.startDate,
          newStartDate: newStartDate.toISOString()
        });
      }
    });
  }
  
  tasks[taskIndex] = updatedTask;
  
  res.json({
    message: 'Task updated successfully',
    task: updatedTask,
    scheduleAdjustments: adjustments
  });
});

// Delete task and its children
router.delete('/:id', authenticateToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  
  // Find all descendant tasks
  const findDescendants = (parentId) => {
    const children = tasks.filter(t => t.parentId === parentId);
    let descendants = [...children];
    
    children.forEach(child => {
      descendants = descendants.concat(findDescendants(child.id));
    });
    
    return descendants;
  };
  
  const tasksToDelete = [taskId, ...findDescendants(taskId).map(t => t.id)];
  
  // Remove all tasks
  tasksToDelete.forEach(id => {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  });
  
  res.json({ 
    message: 'Task and subtasks deleted successfully',
    deletedCount: tasksToDelete.length
  });
});

module.exports = router;
