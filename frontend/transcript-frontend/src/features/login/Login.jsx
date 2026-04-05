import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import axios from "../../api/axios";
import { AuthContext } from "../../store/AuthContext";
import { useNotification } from "../../components/notifications/NotificationContext";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async () => {
    try {

      //  Try admin login
      let response = await axios.post("/api/v1/auth/admin/login", {
        username,
        password,
      });

      //  If admin fails → try student
      if (!response.data.success) {

        response = await axios.post("/api/v1/auth/admin/student/login", {
          username,
          password,
        });

        if (!response.data.success) {
          showNotification("error", response.data.message);
          return;
        }
      }

      //  Extract
      const { token, role } = response.data.data;

      // Save
      login(token, role);

      // Redirect
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/student");
      }

    } catch (error) {
      console.error(error);
      showNotification("error","Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-[#0a0a14] via-[#1e1b4b] to-[#312e81] text-white overflow-hidden">

        {/* ANIMATED GLOW BACKGROUND */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-500/30 blur-[140px] top-[-120px] left-[-120px] rounded-full animate-glow"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] bottom-[-100px] right-[-100px] rounded-full animate-glow"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center text-center px-10 max-w-xl">

          {/* ICON (FLOATING) */}
          <div className="w-20 h-20 mb-8 flex items-center justify-center rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg ">
            <ShieldCheck size={38} />
          </div>

          {/* TITLE */}
          <h1 className="text-5xl font-bold leading-tight mb-4 tracking-tight">
            Transcript Verification Platform
          </h1>

          {/* SUBTEXT */}
          <p className="text-slate-300 text-lg mb-10 max-w-md">
            Secure, blockchain-backed academic verification with zero tampering.
          </p>

          {/* IMAGE WITH PERFECT BLEND + FLOAT */}
          <div className="relative flex justify-center items-center w-full">

            <img
              src="/verify-illustration.svg"
              alt="Verification Illustration"
              className="w-[560px] md:w-[680px] object-contain opacity-95 animate-float transition duration-700 hover:scale-105"
              style={{
                WebkitMaskImage: `
                  radial-gradient(circle at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 75%),
                  linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0)),
                  linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))
                `,
                WebkitMaskComposite: "destination-in",
                maskImage: `
                  radial-gradient(circle at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 75%),
                  linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0)),
                  linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))
                `
              }}
            />

          </div>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-100 via-white to-indigo-100 relative">

        {/* BACKGROUND GLOW */}
        <div className="absolute w-[400px] h-[400px] bg-indigo-300/30 blur-[120px] rounded-full"></div>

        {/* LOGIN CARD */}
        <div className="relative z-10 w-full max-w-md p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl">

          <div className="text-center mb-6 space-y-1">

            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Secure Login
            </h2>

            <p className="text-sm text-slate-500">
              Sign in to access your transcripts and records
            </p>

          </div>

          <div className="space-y-6">

            {/* USERNAME */}
            <div>
              <label className="text-sm text-slate-600">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full p-3 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-slate-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full p-3 rounded-xl bg-white/80 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#3730a3] to-[#312e81] hover:scale-[1.02] active:scale-[0.98] transition text-white p-3 rounded-xl font-medium shadow-lg"
            >
              Continue
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;