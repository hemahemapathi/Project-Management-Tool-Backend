import express from 'express';
import { createProject, updateProject, deleteProject, getAllProjects, getProject } from '../controllers/project.js';
import { authenticateManager, authenticateManagerOrTeamMember } from '../middleware/auth.js';

const router = express.Router();

// Create a new project (manager only)
router.post('/', authenticateManager, createProject);

// Update a project (manager only)
router.put('/:id', authenticateManager, updateProject);

// Delete a project (manager only)
router.delete('/:id', authenticateManager, deleteProject);

// Get all projects (accessible to all users)
router.get('/',authenticateManagerOrTeamMember, getAllProjects);

// Get a single project (accessible to all users)
router.get('/:id',authenticateManagerOrTeamMember, getProject);

export default router;
