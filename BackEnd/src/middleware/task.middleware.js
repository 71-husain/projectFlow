const Task = require("../models/Task");

const canModifyTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.project.owner.toString() === req.user.id;

    const isAdmin = req.user.role === "admin";

    const isTaskCreater = req.user.id === task.createdBy.toString() ;
  
    const isAssigned = !!task.assignedTo;
    const isAssignee = isAssigned && task.assignedTo.toString() === req.user.id;

    const canModify = isAdmin || isAssignee || isTaskCreater || (!isAssigned && isOwner);
    console.log(task.project.owner.toString(),req.user.id)
    console.log(isOwner,isAdmin,isTaskCreater,isAssignee)
    if (!canModify) {
      return res.status(403).json({ message: "Access Denied" });
    }

    req.task = task;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const canDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).populate("project");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const userId = req.user.id;

    const isAdmin = req.user.role === "admin";
    const isProjectOwner =
      task.project.owner?.toString() === userId;
    const isTaskCreator =
      task.createdBy?.toString() === userId;

    const isAssigned = !!task.assignedTo;

    if (
      isAdmin ||
      isProjectOwner ||
      (isTaskCreator && !isAssigned)
    ) {
      req.task = task;
      return next();
    }

    return res.status(403).json({ message: "Cannot delete task" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { canModifyTask ,canDeleteTask};
