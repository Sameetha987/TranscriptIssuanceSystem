import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const CgpaAnalytics = () => {

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    avg: 0,
    max: 0,
    latest: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/v1/student/transcripts");

      const transcripts = res.data.data;

      // 🔹 Format for chart
      const formatted = transcripts.map(t => ({
        semester: `Sem ${t.semester}`,
        cgpa: t.cgpa
      }));

      setData(formatted);

      // 🔹 Calculate stats
      const cgpas = transcripts.map(t => t.cgpa);

      const avg = (cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2);
      const max = Math.max(...cgpas);
      const latest = cgpas[cgpas.length - 1];

      setStats({ avg, max, latest });

    } catch (err) {
      console.error("Failed to load CGPA data");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">

      {/* HEADER */}
      <h2 className="text-lg font-semibold text-slate-800">
        CGPA Analytics
      </h2>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-indigo-50 p-4 rounded-xl text-center">
          <p className="text-sm text-slate-500">Average</p>
          <p className="text-xl font-bold text-indigo-600">{stats.avg}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl text-center">
          <p className="text-sm text-slate-500">Highest</p>
          <p className="text-xl font-bold text-green-600">{stats.max}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <p className="text-sm text-slate-500">Latest</p>
          <p className="text-xl font-bold text-purple-600">{stats.latest}</p>
        </div>

      </div>

      {/* CHART */}
      <div className="h-64">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="semester" />
            <YAxis domain={[0, 10]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="cgpa"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default CgpaAnalytics;