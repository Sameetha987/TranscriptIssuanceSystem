import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">

        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold tracking-wide">
            Admin Panel
          </h2>
        </div>

        <nav className="flex-1 p-6 space-y-3 text-slate-300">

          <Link
            to="/admin"
            className="block px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/students/create"
            className="block px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Create Student
          </Link>

          <Link
            to="/admin/issue"
            className="block px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            Issue Transcript
          </Link>

          <Link
            to="/admin/transcripts"
            className="block px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
          >
            View Transcripts
          </Link>

        </nav>

        <div className="p-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-slate-200 p-10 space-y-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;