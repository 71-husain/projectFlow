import api from "./api";

export const getTasks = projectId => api.get(`/tasks/${projectId}`)

export const getTaskById =taskId => api.get(`/tasks/individual/${taskId}`)

export const createTask = data => api.post(`/tasks`,data)

export const updateTaskStatus = (taskId,status) => api.patch(`/tasks/${taskId}/status`,{status});

export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

export const assignTask = (taskId,userId) => api.patch(`/tasks/${taskId}/assign`,{userId});