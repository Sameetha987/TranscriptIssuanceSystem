import { useState } from "react";
import axios from "../../api/axios";
import { Lock } from "lucide-react";

const ChangePassword = () => {

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put("/api/v1/student/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      alert(res.data.message);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (err) {
      alert(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">

      {/*  HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Security Settings
        </h1>
        <p className="text-slate-500 mt-2 text-md">
          Update your account password to keep your profile secure
        </p>
      </div>

      {/*  MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-16 items-start">

        {/*  LEFT SIDE */}
        <div className="space-y-6 mt-5">

          <h2 className="text-3xl font-bold text-slate-800 leading-snug">
            Keep your account <br />
            <span className="inline-flex items-center gap-2">
                secure <Lock size={25} className="text-indigo-600" />
            </span>
          </h2>

          <p className="text-slate-500">
            Use a strong password that you don’t use elsewhere.
            Updating your password regularly helps protect your academic records.
          </p>

          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl w-fit">
            <p className="text-sm text-indigo-700 leading-relaxed">
              ✔ Use at least 8 characters <br />
              ✔ Include numbers & symbols <br />
              ✔ Avoid common passwords
            </p>
          </div>

        </div>

        {/*  RIGHT SIDE FORM */}
        <div className="relative max-w-md">

          <div className="absolute -top-10 -right-10 w-40 h-40
          bg-indigo-500 opacity-20 blur-3xl rounded-full"></div>

          <div className="p-8 rounded-3xl
          bg-white/70 backdrop-blur-xl
          border border-white/40
          shadow-[0_8px_30px_rgb(0,0,0,0.08)]">

            <h2 className="text-xl font-semibold mb-6 text-slate-800 flex items-center gap-2">
              <Lock size={20} className="text-indigo-600" />
              Change Password
            </h2>

            <div className="space-y-4">

              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl
                bg-white/80 border border-slate-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl
                bg-white/80 border border-slate-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl
                bg-white/80 border border-slate-200
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-medium
                bg-gradient-to-r from-indigo-500 to-purple-600
                hover:scale-[1.02] hover:shadow-lg transition-all"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ChangePassword;