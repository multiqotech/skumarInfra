const Project = require('../models/Project');

// Get all projects for a specific category
const getProjectsByCategory = async (req, res) => {
  try {
    const projects = await Project.find({ category: req.params.category }).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching projects', error: error.message });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching all projects', error: error.message });
  }
};

// Get all projects by projectType
const getProjectsByType = async (req, res) => {
  try {
    const typeMap = {
      'ongoing': 'Ongoing',
      'completed': 'Completed',
      'awarded': 'Awarded'
    };
    const reqType = req.params.type.toLowerCase();
    const projectType = typeMap[reqType];
    
    if (!projectType) {
      return res.status(400).json({ message: 'Invalid project type specified.' });
    }

    const projects = await Project.find({ projectType }).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching classified projects', error: error.message });
  }
};

// Get featured projects (Ongoing and Awarded)
const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ projectType: { $in: ['Ongoing', 'Awarded'] } }).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching featured projects', error: error.message });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching project details', error: error.message });
  }
};

// Create a project
const createProject = async (req, res) => {
  try {
    const { title, category, projectType, image, projectCost, timeToBuild, client, epcContractor, epcSubContractor, location } = req.body;
    
    if (!title || !category || !image) {
      return res.status(400).json({ message: 'Title, category, and image are required' });
    }

    const project = new Project({
      title,
      category,
      projectType: projectType || ['Ongoing'],
      image,
      projectCost,
      timeToBuild,
      client,
      epcContractor,
      epcSubContractor,
      location
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating project', error: error.message });
  }
};

// Update a project
const updateProject = async (req, res) => { console.log('updateProject', req.params.id, req.body);
  try {
    const { title, category, projectType, image, projectCost, timeToBuild, client, epcContractor, epcSubContractor, location } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (project) {
      project.title = title || project.title;
      project.category = category || project.category;
      project.projectType = projectType || project.projectType || ['Ongoing'];
      project.image = image || project.image;
      project.projectCost = projectCost !== undefined ? projectCost : project.projectCost;
      project.timeToBuild = timeToBuild !== undefined ? timeToBuild : project.timeToBuild;
      project.client = client !== undefined ? client : project.client;
      project.epcContractor = epcContractor !== undefined ? epcContractor : project.epcContractor;
      project.epcSubContractor = epcSubContractor !== undefined ? epcSubContractor : project.epcSubContractor;
      project.location = location !== undefined ? location : project.location;
      
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating project', error: error.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => { console.log('deleteProject', req.params.id);
  try {
    const project = await Project.findById(req.params.id);
    
    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting project', error: error.message });
  }
};

// Reorder projects
const reorderProjects = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items array is required' });
    }
    
    const updates = items.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } }
      }
    }));
    
    await Project.bulkWrite(updates);
    res.json({ message: 'Projects reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error reordering projects', error: error.message });
  }
};

module.exports = {
  getProjectsByCategory,
  getAllProjects,
  getProjectsByType,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects
};
