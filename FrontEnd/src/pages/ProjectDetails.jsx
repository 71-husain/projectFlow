import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { getTasks } from "../services/task.api";
import AddMemberForm from "../components/AddMemberForm";
import MemberList from "../components/MemberList";
import { getCurrentUser } from "../utils/auth";
import { assignTask } from "../services/task.api";
import toast from "react-hot-toast";
import { deleteProject } from "../services/project.api";
import { useNavigate } from "react-router-dom";

import {
  getProjectMembers,
  getProjectById,
  addMember,
  removeMember,
} from "../services/project.api";

const ProjectDetails = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function handleFetching() {
      try {
        setLoading(true);
        setError("");

        const [projectRes, taskRes, memberRes] = await Promise.all([
          getProjectById(id),
          getTasks(id),
          getProjectMembers(id),
        ]);

        setProject(projectRes.data);
        setTasks(taskRes.data);
        setMembers(memberRes.data);
      } catch (err) {
        setError("Failed to load project data");
        toast.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    }
    handleFetching();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  const user = getCurrentUser();
  const currentUserId = user?.id;

  const isOwner = project.owner === user?.id || project.owner?._id === user?.id;

  const isAdmin = user?.role === "admin";
  const canManageMembers = isOwner || isAdmin;
  const canDeleteProject = isOwner || isAdmin;

  const handleAssign = async (taskId, userId) => {
    try {
      const res = await assignTask(taskId, userId);

      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));

      toast.success("Task assigned successfully");
    } catch {
      toast.error("Failed to assign task");
    }
  };

  const handleProjectDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete the project and all tasks."
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await deleteProject(id);
      toast.success("Project deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const groupedTasks = {
    pending: tasks.filter((t) => t.status === "pending"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    completed: tasks.filter((t) => t.status === "completed"),
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">{project.name}</h1>
        <p className="text-slate-500 mt-1">Manage tasks, members & workflow</p>
      </div>

      {/* Members Section */}
      <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Project Members
        </h2>

        {canManageMembers && (
          <AddMemberForm
            projectId={id}
            onMemberAdded={(member) => setMembers((prev) => [...prev, member])}
          />
        )}

        <MemberList
          projectOwnerId={project.owner}
          members={members}
          projectId={id}
          onMemberRemoved={(userId) =>
            setMembers((prev) => prev.filter((m) => m._id !== userId))
          }
        />
      </div>

      {/* Tasks Section */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tasks</h2>
          <TaskForm projectId={id} onTaskAdded={setTasks} />
        </div>

        {/* Kanban Board */}
        <div className="grid gap-6 md:grid-cols-3">
          {Object.entries(groupedTasks).map(([status, list]) => (
            <div
              key={status}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
                {status.replace("-", " ")}
              </h3>

              <div className="space-y-3">
                {list.length === 0 && (
                  <p className="text-sm text-slate-400">No tasks</p>
                )}

                {list.map((task) => (
                  <TaskCard
                    key={task._id}
                    project={project}
                    task={task}
                    members={members}
                    onAssign={handleAssign}
                    onStatusChange={(updatedTask) => {
                      setTasks((prev) =>
                        prev.map((t) =>
                          t._id === updatedTask._id ? updatedTask : t
                        )
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {canDeleteProject && (
        <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6">
          <h3 className="text-sm font-semibold text-red-700">Danger Zone</h3>

          <p className="mt-1 text-sm text-red-600">
            Deleting this project will permanently remove all tasks and members.
          </p>

          <button
            onClick={handleProjectDelete}
            disabled={deleting}
            className={`mt-4 inline-flex items-center justify-center rounded-md px-4 py-2
         text-sm font-medium text-white transition
         ${
           deleting
             ? "bg-red-300 cursor-not-allowed"
             : "bg-red-600 hover:bg-red-700"
         }`}
          >
            {deleting ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
