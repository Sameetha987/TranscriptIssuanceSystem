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
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <Link to="/admin" className="block hover:text-blue-400">
            Dashboard
          </Link>

          <Link to="/admin/issue" className="block hover:text-blue-400">
            Issue Transcript
          </Link>

          <Link to="/admin/transcripts" className="block hover:text-blue-400">
            View Transcripts
          </Link>

          <button
            onClick={handleLogout}
            className="mt-6 text-red-400 hover:text-red-600"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;