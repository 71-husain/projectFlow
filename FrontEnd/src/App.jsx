import React from "react";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProjectDetails from "./pages/ProjectDetails";
import Register from "./pages/Register";
import TaskDetails from "./pages/TaskDetails"
import { Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import CompleteRegistration from "./pages/CompleteRegistration";



function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/register" element={<Register />} />    
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/complete-registration" element={<CompleteRegistration />} />
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
