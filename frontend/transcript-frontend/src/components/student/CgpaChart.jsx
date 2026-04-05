import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const CgpaChart = ({ transcripts }) => {

  //  Transform data
  const data = transcripts.map(t => ({
    semester: `Sem ${t.semester}`,
    cgpa: t.cgpa
  }));

  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition">

      <h2 className="text-lg font-semibold mb-4">
        CGPA Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="semester" />

          <YAxis domain={[0, 10]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="cgpa"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 5 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
};

export default CgpaChart;