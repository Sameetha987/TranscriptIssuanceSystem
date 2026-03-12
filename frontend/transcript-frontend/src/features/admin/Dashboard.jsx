import { useEffect, useState } from "react";
import axios from "../../api/axios";
import AdminAnalytics from "../../components/AdminAnalytics";
import AdminRecentActivity from "../../components/AdminRecentActivity";
import { FileText, ShieldCheck, AlertTriangle, Users } from "lucide-react";
const Dashboard = () => {
  const [recentTranscripts, setRecentTranscripts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    authentic: 0,
    tampered: 0
  });

  const fetchRecent = async () => {
      const res = await axios.get("/api/v1/transcripts?page=0&size=5");
      setRecentTranscripts(res.data.content);
  };
  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/v1/transcripts/dashboard");
      setStats(res.data);
    } catch {
      console.error("Failed to load dashboard stats");
    }
  };
  useEffect(() => {
    fetchStats();
    fetchRecent();
  }, []);

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* Total Transcripts */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
      <FileText className="text-blue-700" size={30} />

      <div>
      <p className="text-slate-500 text-sm">Total Transcripts</p>
      <h2 className="text-3xl font-bold">{stats.total}</h2>
      </div>

      </div>

      {/* Verified */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
      <ShieldCheck className="text-green-600" size={30} />

      <div>
      <p className="text-slate-500 text-sm">Verified</p>
      <h2 className="text-3xl font-bold text-green-600">{stats.authentic}</h2>
      </div>

      </div>

      {/* Tampered */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
      <AlertTriangle className="text-red-600" size={30} />
      <div>
      <p className="text-slate-500 text-sm">Tampered</p>
      <h2 className="text-3xl font-bold text-red-600">{stats.tampered}</h2>
      </div>
      </div>

      {/* Students */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
      <Users className="text-purple-600" size={30} />
      <div>
      <p className="text-slate-500 text-sm">Students</p>
      <h2 className="text-3xl font-bold">{stats.totalStudents || 0}</h2>
      </div>

      </div>

      </div>
      {/* Analytics Chart */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminAnalytics stats={stats} />
          <AdminRecentActivity transcripts={recentTranscripts} />
      </div>
    </div>
  );
};

export default Dashboard;