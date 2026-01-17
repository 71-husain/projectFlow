import { useEffect, useState } from "react";
import api from "../services/api";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProjects = async () => {
      try {
        setLoading(true);
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Organize your projects and tasks efficiently
            </p>
          </div>
        </div>

        {/* Create Project Section */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Create New Project
            </h3>
            <ProjectForm onProjectAdded={setProjects} />
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              Your Projects
            </h2>
            <span className="text-sm text-slate-500">
              {projects.length} total
            </span>
          </div>

          {loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <div className="flex justify-center mb-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"></div>
              </div>
              <p className="text-slate-500 text-sm">Loading projects...</p>
            </div>
          )}

          {!loading && projects.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center">
              <p className="text-slate-500">
                No projects yet. Start by creating one 🚀
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
