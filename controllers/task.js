import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { sendTaskCreatedEmail } from '../service/email.js';

// Create a new task (only managers can create tasks)
export const createTask = async (req, res) => {
    try {
      const { title, description, status, priority, dueDate, project, assignedTo } = req.body;
  
      // Check if the project exists
      const projectExists = await Project.findById(project);
      if (!projectExists) {
        return res.status(404).json({ message: 'Project not found' });
      }
  
      const newTask = new Task({
        title,
        description,
        status,
        priority,
        dueDate,
        project,
        assignedTo,
        createdBy: req.user.id
      });
  
      const savedTask = await newTask.save();

      // Add the task to the project's tasks array
      projectExists.tasks.push(savedTask._id);
      await projectExists.save();
  
      // Send email notification
      const populatedTask = await Task.findById(savedTask._id)
        .populate('project', 'name')
        .populate('assignedTo', 'email');

      const teamEmails = populatedTask.assignedTo ? [populatedTask.assignedTo.email] : [];
      
      try {
        await sendTaskCreatedEmail(teamEmails, populatedTask.title, populatedTask.project.name);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue execution even if email sending fails
      }
  
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  
// Update a task (only managers can update tasks)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, projectId, assignedToId } = req.body;

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Check if the user is a manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can update tasks' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If the project is being changed, update the old and new project's task arrays
    if (projectId && task.project.toString() !== projectId) {
      // Remove task from old project
      await Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } });
      // Add task to new project
      await Project.findByIdAndUpdate(projectId, { $push: { tasks: task._id } });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, priority, dueDate, project: projectId, assignedTo: assignedToId },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task (only managers can delete tasks)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Check if the user is a manager
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can delete tasks' });
    }

    const deletedTask = await Task.findById(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Remove the task from the project's tasks array
    await Project.findByIdAndUpdate(deletedTask.project, { $pull: { tasks: deletedTask._id } });

    await Task.findByIdAndDelete(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single task
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//Task Assign to team members by manager
export const assignTask = async (req, res) => {
  try {
    const { id: managerId } = req.user;
    const { taskId, userId } = req.body;

    const manager = await User.findById(managerId);
    if (!manager || manager.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can assign tasks' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'team_member') {
      return res.status(400).json({ message: 'Tasks can only be assigned to team members' });
    }

    // Check if the user is already assigned to an active task
    const activeTask = await Task.findOne({ 
      assignedTo: userId, 
      status: { $in: ['To Do', 'In Progress'] },
      dueDate: { $gt: new Date() }
    });

    if (activeTask) {
      return res.status(400).json({ message: 'This team member is already assigned to an active task' });
    }

    task.assignedTo = userId;
    task.status = 'In Progress';
    task.assignedToName = user.name;
    task.assignedToEmail = user.email;

    await task.save();

    await User.findByIdAndUpdate(userId, {
      $push: { tasks: task._id }
    });

    res.json({ message: 'Task assigned successfully', task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
