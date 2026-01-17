import { Link, useNavigate } from "react-router-dom";import toast from "react-hot-toast";


const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <h3 className="text-xl font-bold text-indigo-600">
          TaskFlow
        </h3>

        
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-600 hover:text-indigo-600 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-sm text-slate-600 hover:text-indigo-600 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-slate-600 hover:text-indigo-600 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
