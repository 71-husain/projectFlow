import { useState } from "react";
import { userRegister } from "../services/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await userRegister({ name, email, password});
      navigate("/login");
      toast.success("Registered Successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      toast.error(error.response?.data.message);
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full rounded-xl border border-slate-300
                 px-4 py-3 pr-12
                 text-slate-800 placeholder-slate-400
                 focus:outline-none focus:ring-2 focus:ring-indigo-500
                 focus:border-indigo-500 transition
                 disabled:bg-slate-100 disabled:cursor-not-allowed"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center
                 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
