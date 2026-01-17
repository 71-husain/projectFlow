import { useState } from "react";
import { createTask } from "../services/task.api";
import toast from "react-hot-toast";

const TaskForm = ({ projectId, onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);

      const res = await createTask({ title, description, projectId });
      onTaskAdded((prev) => [...prev, res.data]);

      toast.success("Task created successfully");

      setTitle("");
      setDescription("");
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Add New Task
      </h3>

      <form onSubmit={submitHandler} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Task Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            placeholder="Short description about the task..."
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3
                       text-slate-800 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500 transition resize-none"
          />
        </div>

        {/* Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center
                       rounded-xl px-6 py-3
                       text-sm font-semibold text-white
                       ${
                         loading
                           ? "bg-indigo-400 cursor-not-allowed"
                           : "bg-indigo-600 hover:bg-indigo-700"
                       }
                       active:scale-[0.98]
                       transition-all`}
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
