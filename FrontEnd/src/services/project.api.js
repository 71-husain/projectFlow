import api from "./api";

export const getProjects = () => api.get("/projects")

export const getProjectById = (projectId) => api.get(`/projects/${projectId}`);

export const createProject = (data) => api.post('/projects',data);

export const addMember = (projectId,email) => api.post(`/projects/${projectId}/members`,{email})

export const removeMember = (projectId,userId) => api.delete(`/projects/${projectId}/members/${userId}`)

export const getProjectMembers = (projectId) => api.get(`/projects/${projectId}/members`)

export const deleteProject = (projectId) => api.delete(`/projects/${projectId}`)