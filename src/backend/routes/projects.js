const express = require('express');
const { validateProject } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Mock projects database
const projects = [];

// Get all projects for authenticated user
router.get('/', authenticateToken, (req, res) => {
  const userProjects = projects.filter(p => p.userId === req.user.userId);
  res.json(userProjects);
});

// Create new project
router.post('/', authenticateToken, validateProject, (req, res) => {
  const { name, description, startDate, endDate } = req.body;
  
  const project = {
    id: projects.length + 1,
    name,
    description,
    startDate,
    endDate,
    userId: req.user.userId,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  projects.push(project);
  
  res.status(201).json({
    message: 'Project created successfully',
    project
  });
});

// Get specific project
router.get('/:id', authenticateToken, (req, res) => {
  const project = projects.find(p => 
    p.id === parseInt(req.params.id) && p.userId === req.user.userId
  );
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.json(project);
});

// Update project
router.put('/:id', authenticateToken, validateProject, (req, res) => {
  const projectIndex = projects.findIndex(p => 
    p.id === parseInt(req.params.id) && p.userId === req.user.userId
  );
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  projects[projectIndex] = {
    ...projects[projectIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    message: 'Project updated successfully',
    project: projects[projectIndex]
  });
});

// Delete project
router.delete('/:id', authenticateToken, (req, res) => {
  const projectIndex = projects.findIndex(p => 
    p.id === parseInt(req.params.id) && p.userId === req.user.userId
  );
  
  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  projects.splice(projectIndex, 1);
  
  res.json({ message: 'Project deleted successfully' });
});

module.exports = router;
