import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { FileText, ShieldCheck, AlertTriangle } from "lucide-react";

const AdminAnalytics = ({ stats }) => {

  const chartData = [
    { name: "Verified", value: stats.authentic },
    { name: "Tampered", value: stats.tampered }
  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Chart */}

      <div className="bg-white p-6 rounded-2xl shadow border col-span-3">

        <h3 className="text-lg font-semibold mb-4">Verification Status</h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1d4ed8" />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>

  );
};

export default AdminAnalytics;