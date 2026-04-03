import { useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200 shadow-sm transition-all duration-300">

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-indigo-600 text-white p-2 rounded-lg group-hover:scale-105 transition">
            <ShieldCheck size={18} />
          </div>

          <span className="font-bold text-slate-800 text-lg tracking-tight">
            TranscriptVerify
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* VERIFY BUTTON */}
          <button
            onClick={() => navigate("/verify")}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Verify
          </button>

          {/* ADMIN LOGIN */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <LogIn size={16} />
            Admin Login
          </button>

        </div>

      </div>
    </div>
  );
};

export default Navbar;