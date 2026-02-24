import { useEffect, useState } from "react";
import axios from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import { useNavigate } from "react-router-dom";

const AdminTranscripts = () => {

  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationMap, setVerificationMap] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    fetchTranscripts();
  }, []);

  const downloadPdf = async (id) => {
    try {
      const response = await axios.get(
        `/api/transcripts/${id}/pdf`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transcript_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("PDF download failed", error);
    }
  };

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get("/api/transcripts");
      const data = response.data;
      setTranscripts(data);

      // Verify each transcript
      const verificationResults = {};

      for (let t of data) {
        try {
          const verifyRes = await axios.get(
            `/api/transcripts/verify/${t.id}`
          );

          verificationResults[t.id] =
            verifyRes.data.data.status;

        } catch {
          verificationResults[t.id] = "BLOCKCHAIN_ERROR";
        }
      }

      setVerificationMap(verificationResults);

    } catch (error) {
      console.error("Error fetching transcripts", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!loading && transcripts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-10 text-center">
        <h2 className="text-xl font-semibold text-slate-700">
          No Transcripts Yet
        </h2>
        <p className="text-slate-500 mt-2">
          Issue a transcript to see it listed here.
        </p>
      </div>
    );
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
              <th className="px-6 py-4">Actions</th>
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
                  <StatusBadge status={verificationMap[t.id]} />
                </td>
                <td className="px-6 py-4 space-x-2">

                  <button
                    onClick={() => downloadPdf(t.id)}
                    className="px-3 py-1 text-sm bg-blue-800 text-white rounded-md hover:bg-blue-900 transition"
                  >
                    PDF
                  </button>

                  <button
                    onClick={() => window.open(`http://localhost:8080/api/transcripts/public/verify/${t.id}`)}
                    className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
                  >
                    Verify
                  </button>

                  <button
                    onClick={() => navigate(`/admin/transcripts/${t.id}`)}
                    className="px-3 py-1 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-900 transition"
                  >
                    View
                  </button>

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