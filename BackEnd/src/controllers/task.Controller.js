const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "missing fields" });
    }

    const taskData = {
      title,
      description,
      project: projectId,
      status: "pending",
      priority: "medium",
      createdBy: req.user.id,
    };

    // only assign if provided
    if (assignedTo) {
      taskData.assignedTo = assignedTo;
    }

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("createdBy", "name");
    if (!tasks) {
      return res
        .status(401)
        .json({ message: "No tasts Exist for this project" });
    }
    res.status(201).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "name email")
      .populate("project", "name owner")
      .populate("createdBy", "name");
    if (!task) {
      return res.status(401).json({ message: "No task exist for this id" });
    }

    res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  Object.assign(req.task, req.body);
  await req.task.save();
  res.json(req.task);
};

exports.deleteTask = async (req, res) => {
  await req.task.deleteOne();
  res.json({ message: "Task deleted" });
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "invalid status" });
    }

    req.task.status = status;
    await req.task.save();

    res.json(req.task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Task.findById(taskId).populate("project") || req.task;

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = task.project;

    const isMember =
      project.owner.toString() === userId ||
      project.members.some((m) => m.toString() === userId);

    if (!isMember) {
      return res.status(400).json({
        message: "User is not a member of this project",
      });
    }

    task.assignedTo = userId;
    await task.save();

    await task.populate("assignedTo", "name email");

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
