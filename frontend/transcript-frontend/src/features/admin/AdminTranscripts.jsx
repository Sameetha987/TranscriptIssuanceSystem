import { useEffect, useState } from "react";
import axios from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

const AdminTranscripts = () => {

  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get("/api/transcripts");
      setTranscripts(response.data);
    } catch (error) {
      console.error("Error fetching transcripts", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-10">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-800"></div>
           </div>;
  }

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Transcripts
        </h1>
        <p className="text-slate-500 mt-1">
          Manage and verify issued transcripts
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-100 text-slate-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4">CGPA</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {transcripts.map((t) => (
              <tr
                key={t.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  #{t.id}
                </td>
                <td className="px-6 py-4">{t.studentName}</td>
                <td className="px-6 py-4">{t.semester}</td>
                <td className="px-6 py-4">{t.cgpa}</td>
                <td className="px-6 py-4">
                  <StatusBadge
                    status={
                      t.blockchainHash ? "AUTHENTIC" : "PENDING"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminTranscripts;