import { useEffect, useState } from "react";
import axios from "../../api/axios";

const Dashboard = () => {

  useEffect(() => {
    fetchStats();
  }, []);
  const [stats, setStats] = useState({
    total: 0,
    authentic: 0,
    tampered: 0
  });
  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/transcripts/dashboard");
      setStats(res.data);
    } catch {
      console.error("Failed to load dashboard stats");
    }
  };

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Total */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-800 p-6">
          <p className="text-slate-500 text-sm">Total Transcripts</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {stats.total}
          </h2>
        </div>

        {/* Authentic */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-emerald-600 p-6">
          <p className="text-slate-500 text-sm">Authentic</p>
          <h2 className="text-3xl font-bold text-emerald-700 mt-2">
            {stats.authentic}
          </h2>
        </div>

        {/* Tampered */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-red-600 p-6">
          <p className="text-slate-500 text-sm">Tampered</p>
          <h2 className="text-3xl font-bold text-red-700 mt-2">
            {stats.tampered}
          </h2>
        </div>

      </div>


    </div>
  );
};

export default Dashboard;