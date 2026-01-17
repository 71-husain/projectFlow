const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task")

const canAccessProject = async (req, res, next) => {
  try {
     let project;

    // 1️⃣ If projectId exists (projects routes)
    if (req.params.projectId) {
      project = await Project.findById(req.params.projectId);
    }

    // 2️⃣ If taskId exists (task routes)
    else if (req.params.taskId) {
      const task = await Task.findById(req.params.taskId).populate("project");
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      project = task.project;
      req.task = task; // optional reuse
    }

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = project.owner && project.owner.toString() === req.user.id;
    const isProjectMember = project.members.some(
      (memberId) => memberId.toString() === req.user.id
    );

    if (!isAdmin && !isOwner && !isProjectMember) {
      return res.status(403).json({ message: "Access Denied" });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error("canAccessProject error:", error);
    return res.status(500).json({ message: "Project access check failed" });
  }
};

module.exports = {canAccessProject};