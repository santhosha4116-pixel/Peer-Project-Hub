const Project = require("../models/Project");

async function getProjects(req, res) {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
  
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Project.countDocuments(filter);
    
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
      res.json({
      projects,
      page,
      pages: Math.ceil(total / limit),
      total,  
      
    });
    
  } catch (error) {
    res.status(500).json({ message: "Unable to get projects" });
  }
}

async function getProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);
  
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project) ;
  } catch (error) {
    res.status(500).json({ message: "Unable to get project" });
  }
}

async function createProject(req, res) {
  try {
    const { title, description, tags, githubUrl, liveUrl } = req.body;

    if (!title || !description || !tags || !githubUrl) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const project = await Project.create({
      title,
      description,
      tags,
      githubUrl,
      liveUrl,
      ownerUid: req.user.uid,
      ownerEmail: req.user.email,
      ownerName: req.user.name || "",
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Unable to create project" });
  }
}

async function updateProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);
 
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerUid !== req.user.uid) {
      return res.status(403).json({ message: "You can edit only your own project" });
    }

    const { title, description, tags, githubUrl, liveUrl } = req.body;

    project.title = title;
    project.description = description;
    project.tags = tags;
    project.githubUrl = githubUrl;
    project.liveUrl = liveUrl;

    await project.save();

    res.json(project)
   
  } catch (error) {
    res.status(500).json({ message: "Unable to update project" });
  }
}

async function deleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerUid !== req.user.uid) {
      return res.status(403).json({ message: "You can delete only your own project" });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete project" });
  }
}

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};