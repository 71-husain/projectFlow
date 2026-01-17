import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => project?._id && navigate(`/project/${project._id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && project?._id) {
          navigate(`/project/${project._id}`);
        }
      }}
      role="button"
      tabIndex={0}
      className="
        cursor-pointer
        rounded-2xl
        border border-slate-200
        bg-white
        select-none
        p-6
        shadow-sm
        transition-all
        hover:-translate-y-1
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        active:scale-[0.99]
      "
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-1">
        {project.name || "Untitled Project"}
      </h3>

      {project.description && (
        <p className="text-sm text-slate-500 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-medium text-indigo-600">
          View Project →
        </span>
      </div>
    </div>
  );
};

export default ProjectCard;
