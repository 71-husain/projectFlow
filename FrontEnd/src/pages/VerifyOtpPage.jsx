import { useState ,useEffect } from "react";
import { verifyOtp, resendOtp } from "../services/auth.api";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (resendCooldown === 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await verifyOtp({ email, otp });

      const verificationToken = res.data.verificationToken;

      toast.success("OTP verified");

      navigate("/complete-registration", {
        state: { verificationToken },
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "OTP verification failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp(e) {
    try {
      if (resendCooldown > 0) return;

      await resendOtp({ email });
      toast.success("OTP resend to your Email");

      setResendCooldown(30);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-slate-500 mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full rounded-xl border border-slate-300 px-4 py-3
                         text-slate-800 placeholder-slate-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 transition"
              required
            />

            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-slate-500">Didn't receive the OTP?</span>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-indigo-600 font-medium hover:text-indigo-700 disabled:text-gray-400"
              >
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

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
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtpPage;
