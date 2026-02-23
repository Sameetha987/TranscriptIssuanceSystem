import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../store/AuthContext";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/auth/admin/login", {
        username,
        password,
      });

      const token = response.data.data;
      login(token, "ADMIN");
      navigate("/admin");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Branding Panel */}
      <div className="hidden md:flex w-1/2 bg-slate-900 text-white flex-col justify-center px-16">

        <h1 className="text-4xl font-bold mb-6 leading-tight">
          University Transcript System
        </h1>

        <p className="text-slate-300 text-lg mb-8">
          Secure • Blockchain Verified • Tamper Proof
        </p>

        <div className="h-1 w-24 bg-emerald-500 rounded"></div>

      </div>

      {/* Right Login Form */}
      <div className="flex flex-1 items-center justify-center bg-white">

        <div className="w-full max-w-md p-10 border border-gray-200 rounded-2xl shadow-xl">

          <h2 className="text-2xl font-semibold text-slate-800 mb-8 text-center">
            Admin Login
          </h2>

          <div className="space-y-6">

            <div>
              <label className="text-sm font-medium text-slate-600">
                Username
              </label>
              <input
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-blue-800 hover:bg-blue-900 transition text-white p-3 rounded-lg font-medium"
            >
              Sign In
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLogin;