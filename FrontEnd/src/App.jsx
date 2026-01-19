import React from "react";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProjectDetails from "./pages/ProjectDetails";
import Register from "./pages/Register";
import TaskDetails from "./pages/TaskDetails"
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};


function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/individual/:taskId"
            element={
              <ProtectedRoute>
                <TaskDetails/>
              </ProtectedRoute>
            }
          />
        </Routes>
    </>
  );
}

export default App;
