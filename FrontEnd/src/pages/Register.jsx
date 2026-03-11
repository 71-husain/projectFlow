import { useState } from "react";
import { initRegister } from "../services/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await initRegister({ name, email });

      toast.success("OTP sent to your email");

      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      toast.error(error.response?.data.message || "Something Went Wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Create Account
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Start managing projects with TaskFlow
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3
                         text-slate-800 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
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

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

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
                             ? "bg-indigo-400"
                             : "bg-indigo-600 hover:bg-indigo-700"
                         }
                         active:scale-[0.98]
                         transition-all`}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
