import React, { useEffect, useState } from "react";
import { getTaskById } from "../services/task.api";
import { useParams } from "react-router-dom";
import { deleteTask } from "../services/task.api";
import { getCurrentUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    getTaskById(taskId)
      .then((res) => setTask(res.data))
      .catch(() => {
        toast.error("Failed to load task");
        navigate(-1);
      });
  }, [taskId]);

  if (!task)
   return (
     <p className="text-center text-slate-500">
       Loading task details...
     </p>
   );

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteTask(task._id);

      toast.success("Task deleted successfully");
      navigate(-1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete task");
    } finally {
      setDeleting(false);
    }
  }

  const user = getCurrentUser();

  const isAdmin = user?.role === "admin";
  const isTaskCreator =
    task.createdBy === user?.id || task.createdBy?._id === user?.id;
  const isProjectOwner =
    task.project.owner === user?.id || task.project.owner?._id === user?.id;
  const isAssigned = !!task.assignedTo;
  const canDelete = isAdmin || isProjectOwner || (isTaskCreator && !isAssigned);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Task Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            {task.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {task.description || "No description provided"}
          </p>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500">Status</p>
            <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {task.status}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-500">Priority</p>
            <span className="mt-1 inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
              {task.priority}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-500">Project</p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {task.project?.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Assigned To</p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {task.assignedTo?.name || "Unassigned"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Created By</p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {task.createdBy?.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Created At</p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      {canDelete && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <h4 className="text-sm font-semibold text-red-700">Danger Zone</h4>
          <p className="mt-1 text-xs text-red-600">
            Deleting this task is permanent and cannot be undone.
          </p>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`mt-3 rounded-md px-4 py-2 text-sm font-medium text-white transition ${
              deleting
                ? "cursor-not-allowed bg-red-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {deleting ? "Deleting..." : "Delete Task"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskDetails;
