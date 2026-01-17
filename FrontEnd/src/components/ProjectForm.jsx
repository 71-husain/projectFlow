import react from "react";
import { useState } from "react";
import { createProject } from "../services/project.api";
import toast from "react-hot-toast";

function ProjectForm({ onProjectAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await createProject({ name, description });
      onProjectAdded((prev) => [...prev, res.data]);
      toast.success("Project created successfully");
      setName("");
      setDescription("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Project Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. TaskFlow Redesign"
          className="w-full rounded-xl border border-slate-300 px-4 py-3
                     text-slate-800 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:border-indigo-500 transition"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description about the project..."
          rows={3}
          className="w-full rounded-xl border border-slate-300 px-4 py-3
                     text-slate-800 placeholder-slate-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500
                     focus:border-indigo-500 transition resize-none"
        />
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center justify-center
                     rounded-xl  px-6 py-3
                     text-sm font-semibold text-white
                     ${
                       loading
                         ? "bg-indigo-400"
                         : "bg-indigo-600 hover:bg-indigo-700"
                     }
                     active:scale-[0.98]
                     transition-all`}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;
