import { useEffect, useState } from "react";
import axios from "../../api/axios";

const Dashboard = () => {

  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/transcripts/stats");
      setTotal(response.data);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-800 p-6">
          <p className="text-slate-500 text-sm">Total Transcripts</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {total}
          </h2>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;