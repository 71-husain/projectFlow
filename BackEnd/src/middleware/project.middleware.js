const Project = require("../models/Project");

const isProjectMember = async (req, res, next) => {
  const projectId = req.params.projectId || req.body.projectId;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(401).json({ message: "project not found" });
  }

  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user.id
  );
  if (!isMember) {
    return res.status(403).json({ message: "Not a member of project" });
  }

  req.project = project; 
  next();
};



module.exports = { isProjectMember };
