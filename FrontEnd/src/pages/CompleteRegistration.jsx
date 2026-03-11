import { useState } from "react";
import { userRegister} from "../services/auth.api";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function CompleteRegistration() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const verificationToken = location.state?.verificationToken;

  async function handleCompleteRegistration(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res =  await userRegister({
        password,
        verificationToken,
      });

      const token = res.data.token;

      localStorage.setItem("token",token);

      toast.success("Account created successfully");

      navigate("/dashboard");

    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed";

      setError(message);
      toast.error(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">

        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Set Password
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Create a secure password to complete your registration
        </p>

        <form onSubmit={handleCompleteRegistration} className="space-y-5">

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

export default CompleteRegistration;