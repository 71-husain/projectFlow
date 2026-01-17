import { useNavigate } from "react-router-dom";
import { updateTaskStatus } from "../services/task.api";
import { getCurrentUser } from "../utils/auth";
import toast from "react-hot-toast";
import { useState } from "react";

const TaskCard = ({ task, members, onAssign, project, onStatusChange }) => {
  const navigate = useNavigate();
  const [statusLoading, setStatusLoading] = useState(false);

  const user = getCurrentUser();
  const userId = user?.id;

  const isAdmin = user?.role === "admin";

  const isTaskCreator = task.createdBy && task.createdBy.toString() === userId;

  const isAssignee = task.assignedTo && task.assignedTo.toString() === userId;

  const isProjectOwner =
    project.owner === userId || project.owner?._id === userId;

  const canModifyTask =
    isAdmin || isTaskCreator || isAssignee || isProjectOwner;

  const canAssignTask = isAdmin || isProjectOwner

  const handleChange = async (e) => {
    const newStatus = e.target.value;

    if (!canModifyTask) return;

    if (newStatus === task.status) return;

  try {
    setStatusLoading(true);

    const res = await updateTaskStatus(task._id, newStatus);
    onStatusChange(res.data);

    toast.success("Task status updated");
  } catch (err) {
    toast.error("Failed to update task status");
  } finally {
    setStatusLoading(false);
  }
  };

  return (
  <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    
    {/* Title */}
    <h4
      onClick={() => navigate(`/tasks/individual/${task._id}`)}
      className="cursor-pointer text-sm font-semibold text-slate-800 group-hover:text-indigo-600"
    >
      {task.title}
    </h4>

    {/* Assigned To */}
    <div className="mt-3">
      <label className="mb-1 block text-xs font-medium text-slate-500">
        Assigned to
      </label>

      <select
        value={task.assignedTo?._id || ""}
        onChange={(e) => onAssign(task._id, e.target.value)}
        disabled={!canAssignTask}
        className={`w-full rounded-md border px-2 py-1 text-sm outline-none transition
          ${
            canAssignTask
              ? "border-slate-300 bg-white focus:border-indigo-500"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }
        `}
      >
        <option value="">Unassigned</option>

        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name || m.email}
          </option>
        ))}
      </select>
    </div>

    {/* Status */}
    <div className="mt-3">
      <label className="mb-1 block text-xs font-medium text-slate-500">
        Status
      </label>

      <select
        value={task.status}
        onChange={handleChange}
        disabled={!canModifyTask || statusLoading}
        className={`w-full rounded-md px-2 py-1 text-sm font-medium outline-none transition
          ${
            task.status === "pending"
              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
              : task.status === "in-progress"
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }
          ${!canModifyTask && "cursor-not-allowed opacity-70"}
          ${statusLoading && "opacity-60"}
        `}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    {/* Permission Note */}
    {!canModifyTask && (
      <p className="mt-1 text-xs text-slate-400">
        Only project owner or admin can assign tasks
      </p>
    )}
  </div>
);

};

export default TaskCard;
