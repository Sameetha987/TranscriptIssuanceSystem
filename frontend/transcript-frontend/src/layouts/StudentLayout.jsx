import { Link, Outlet, useNavigate, useLocation} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Key } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  GraduationCap
} from "lucide-react";

const StudentLayout = () => {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/v1/student/profile");
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/student",
      icon: <LayoutDashboard size={18} />
    },
    {
      name: "My Transcripts",
      path: "/student/transcripts",
      icon: <FileText size={18} />
    },
    {
      name: "Profile",
      path: "/student/profile",
      icon: <User size={18} />
    },
    {
      name: "Change Password",
      path: "/student/change-password",
      icon: <Key size={18} />
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-[#0f172a] to-[#020617] text-white flex flex-col shadow-xl">

        {/* LOGO / HEADER */}
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">

          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
            <GraduationCap size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-wide">
              Student Portal
            </h2>
            <p className="text-xs text-slate-400">
              Transcript System
            </p>
          </div>

        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">

          {menu.map((item) => {

            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:translate-x-1
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );

          })}

        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-700">

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 space-y-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-bold text-slate-800">
            Student Dashboard
          </h1>

          <div className="flex items-center gap-3">

            <div className=" bg-white px-4 py-2 rounded-xl shadow border text-md text-slate-800 flex items-center gap-2">

              <GraduationCap size={20} className="text-indigo-500" />

              <span>
                Welcome {user?.name || "Student"}
              </span>

            </div>

          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="bg-white rounded-2xl shadow-md p-6 min-h-[75vh]">

          <Outlet />

        </div>

      </div>

    </div>
  );
};

export default StudentLayout;