const express = require("express");
const auth = require("../middleware/auth.middleware");
const isProjectOwner= require("../middleware/owner.middleware");
const {isProjectMember} = require("../middleware/project.middleware");


const {createProject,getProjects,getProjectById,addMember,removeMember, getProjectMembers ,deleteProject} = require("../controllers/project.Controller");
const { canAccessProject } = require("../middleware/canAccessProject.middleware");

const Router = express.Router();

Router.post("/",auth,createProject);
Router.get("/",auth,getProjects);   
Router.get("/:projectId",auth,getProjectById);
Router.delete("/:projectId",auth,canAccessProject,deleteProject);


//member management 
 
Router.get("/:projectId/members",auth,canAccessProject,getProjectMembers);
Router.post("/:projectId/members",auth,canAccessProject,isProjectOwner,addMember);
Router.delete("/:projectId/members/:userId",auth,canAccessProject,isProjectOwner,removeMember);

module.exports = Router; 