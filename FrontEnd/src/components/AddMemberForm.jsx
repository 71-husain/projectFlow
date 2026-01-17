import { useState } from "react";
import { addMember } from "../services/project.api";
import toast from "react-hot-toast";

const AddMemberForm = ({ projectId, onMemberAdded }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);

      const res = await addMember(projectId, email);
      onMemberAdded(res.data);

      toast.success("Member added successfully");
      setEmail("");
    } catch (err) {
      toast.error("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Add Project Member
      </h3>

      <form onSubmit={submitHandler} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Member Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@example.com"
            className="w-full rounded-xl border border-slate-300 px-4 py-3
                       text-slate-800 placeholder-slate-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500 transition"
            required
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
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberForm;
