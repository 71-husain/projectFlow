const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task")

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      owner: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    }).populate("owner", "name email");

    if (!projects) {
      return res.status(201).json({ message: "No Project Exists" });
    }

    res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user.id;
    const userRole = req.user.role;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const ownerId = project.owner.toString();

    const isOwner = ownerId === userId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this project",
      });
    }

    await Task.deleteMany({ project: projectId });

    await project.deleteOne();

    return res.status(200).json({
      message: "Project and related tasks deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "owner",
      "name email"
    );

    if (!project) {
      return res.status(201).json({ message: "No Project Exists" });
    }

    res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getProjectMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "members",
      "name email"
    );

    if (!project) {
      return res
        .status(401)
        .json({ message: "No project exist with this projectId" });
    }

    res.json(project.members);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (req.project.members.includes(user._id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    req.project.members.push(user._id);
    await req.project.save();

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const userIdToRemove = req.params.userId;
    const currentUserId = req.user.id;
    if (userIdToRemove === req.project.owner.toString()) {
      return res
        .status(400)
        .json({ message: "owner can not be removed from the project" });
    }

    if (currentUserId === userIdToRemove) {
      return res
        .status(400)
        .json({ message: "cant remove yourself from the project" });
    }

    req.project.members = req.project.members.filter(
      (id) => id.toString() !== req.params.userId
    );
    await req.project.save();
    res.json({ message: "member removed" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
