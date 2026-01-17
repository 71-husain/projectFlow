const express = require("express");
const auth = require("../middleware/auth.middleware");
const {isProjectMember} = require("../middleware/project.middleware");
const {canModifyTask, canDeleteTask} = require("../middleware/task.middleware")
const {canAccessProject} = require("../middleware/canAccessProject.middleware")

const {createTask,getTasksByProject,updateTask,deleteTask, getTaskById, updateTaskStatus,assignTask} = require("../controllers/task.Controller");

const Router = express.Router();

Router.post("/",auth,createTask);
Router.get("/:projectId",auth,getTasksByProject);

Router.get("/individual/:taskId",getTaskById);
Router.patch("/:taskId/status",auth,canModifyTask,updateTaskStatus);
Router.put("/:taskId",auth,canModifyTask,updateTask);
Router.delete("/:taskId",auth,canDeleteTask,deleteTask)
Router.patch("/:taskId/assign",auth,canAccessProject,assignTask);

module.exports = Router;