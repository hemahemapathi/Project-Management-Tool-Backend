import Project from '../models/Project.js';
import User from '../models/User.js';
import { sendProjectCreatedEmail } from '../service/email.js';

// Create a new project (manager only)
export const createProject = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can create projects' });
    }

    const newProject = new Project({
      ...req.body,
      manager: userId,
      startDate: new Date()
    });

    const savedProject = await newProject.save();
    
    const populatedProject = await Project.findById(savedProject._id)
      .populate('manager', 'name email')
      .populate('team_members', 'email');

    // Send email notification
    const teamEmails = populatedProject.team_members.map(member => member.email);
    await sendProjectCreatedEmail(teamEmails, populatedProject.name);

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
};


// Update a project (manager only)
export const updateProject = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.manager.toString() !== userId) {
      return res.status(403).json({ message: 'Only the project manager can update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true })
      .populate('manager', 'name email')
      .populate('team_members', 'name email');
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a project (manager only)
export const deleteProject = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.manager.toString() !== userId) {
      return res.status(403).json({ message: 'Only the project manager can delete this project' });
    }

    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all projects (accessible to all users)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('manager', 'name email')
      .populate('team_members', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single project (accessible to all users)
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate('manager', 'name email')
      .populate('team_members', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};