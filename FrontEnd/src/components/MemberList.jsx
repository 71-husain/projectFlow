import { removeMember } from "../services/project.api";
import { getCurrentUser } from "../utils/auth";
import { useState } from "react";
import toast from "react-hot-toast";

const MemberList = ({
  members,
  projectOwnerId,
  projectId,
  onMemberRemoved,
}) => {
  const user = getCurrentUser();
  const currentUserId = user?.id;
  const [removingId, setRemovingId] = useState(null);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white">
      <ul className="divide-y divide-slate-200">
        {members.map((member) => {
          const isOwner =
            member._id === projectOwnerId || member._id === projectOwnerId?._id;

          const areYouOwner =
            currentUserId === projectOwnerId ||
            currentUserId === projectOwnerId?._id;

          const isCurrentUser = member._id === currentUserId;
          const canRemove = !isOwner && !isCurrentUser && areYouOwner;

          const displayName = member.name || member.email;
          const initials = displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <li
              key={member._id}
              className="flex items-center justify-between px-4 py-3"
            >
              {/* Left side */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {initials}
                </div>

                {/* Name  badges */}
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {displayName}
                  </p>

                  <div className="mt-0.5 flex gap-2">
                    {isOwner && (
                      <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                        Owner
                      </span>
                    )}

                    {isCurrentUser && !isOwner && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        You
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right side */}
              {canRemove && (
                <button
                  onClick={async () => {
                    const confirmed = window.confirm(
                      `Remove ${displayName} from this project?`
                    );

                    if (!confirmed) return;
                    try {
                      setRemovingId(member._id);
                      await removeMember(projectId, member._id);
                      onMemberRemoved(member._id);
                      toast.success("Member removed successfully");
                    } catch (err) {
                      toast.error(
                        err?.response?.data?.message ||
                          "Failed to remove member"
                      );
                    } finally {
                      setRemovingId(null);
                    }
                  }}
                  disabled={removingId === member._id}
                  className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                    removingId === member._id
                      ? "cursor-not-allowed border-red-200 bg-red-100 text-red-400"
                      : "border-red-200 text-red-600 hover:bg-red-50"
                  }`}
                >
                  {removingId === member._id ? "Removing..." : "Remove"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MemberList;
