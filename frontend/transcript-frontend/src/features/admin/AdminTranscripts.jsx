import { useEffect, useState } from "react";
import axios from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminTranscripts = () => {

  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationMap, setVerificationMap] = useState({});
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  useEffect(() => {
    fetchTranscripts();
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentRecords = transcripts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(transcripts.length / recordsPerPage);

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

  const reVerify = async (id) => {
    try {
      const res = await axios.get(`/api/transcripts/verify/${id}`);
      setVerificationMap(prev => ({
        ...prev,
        [id]: res.data.data.status
      }));

      toast.success("Verification updated");
    } catch {
      toast.error("Verification failed");
    }
  };

  const fetchTranscripts = async () => {
    try {
      const response = await axios.get("/api/transcripts");

      console.log("FULL RESPONSE:", response.data);

      const list = response.data;

      if (!Array.isArray(list)) {
        console.error("Transcripts is not array:", list);
        setTranscripts([]);
        return;
      }

      setTranscripts(list);

      const verificationResults = {};

      for (let t of list) {
        if (!t?.id) continue;

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
      setTranscripts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-16 bg-slate-200 rounded-xl animate-pulse"></div>
        ))}
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
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to archive this transcript?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/transcripts/${id}`);

      toast.success("Transcript archived successfully");

      setTranscripts(prev =>
        prev.filter(t => t.id !== id)
      );

    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Transcript Management
        </h1>
        <p className="text-slate-500 mt-2">
          Monitor, verify and manage issued academic transcripts
        </p>
      </div>

      {/* CONTROL BAR */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">

        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search by name or roll number..."
            className="w-full p-3 pl-4 border rounded-xl focus:ring-2 focus:ring-blue-800 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-sm">
            Total: <span className="font-semibold text-slate-800">{transcripts.length}</span>
          </span>

          <select className="p-3 border rounded-xl focus:ring-2 focus:ring-blue-800 focus:outline-none">
            <option>All</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Tampered</option>
          </select>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-900 text-white text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-5">ID</th>
              <th className="px-6 py-5">Student</th>
              <th className="px-6 py-5">Semester</th>
              <th className="px-6 py-5">CGPA</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRecords.map((t) => (
              <tr
                key={t.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-6 py-5 font-semibold text-slate-800">
                  #{t.id}
                </td>

                <td className="px-6 py-5">
                  <div className="font-semibold text-slate-800">
                    {t.student?.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {t.student?.studentRoll}
                  </div>
                </td>

                <td className="px-6 py-5 font-medium text-slate-700">
                  {t.semester}
                </td>

                <td className="px-6 py-5 font-semibold text-blue-800">
                  {t.cgpa}
                </td>

                <td className="px-6 py-5">
                  <StatusBadge status={verificationMap[t.id]} />
                </td>

                <td className="px-6 py-5">
                  <div className="flex gap-2">

                    <button
                      onClick={() => downloadPdf(t.id)}
                      className="px-3 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition transform hover:scale-105 active:scale-95"
                    >
                      PDF
                    </button>

                    <button
                      onClick={() => reVerify(t.id)}
                      className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition transform hover:scale-105 active:scale-95"
                    >
                      Re-Verify
                    </button>

                    <button
                      onClick={() => {
                          console.log("Navigating with ID:", t.id);
                          navigate(`/admin/transcripts/${t.id}`);
                          }}
                      className="px-3 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition transform hover:scale-105 active:scale-95"
                    >
                      View
                    </button>
                    <button
                        onClick={() => handleDelete(t.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-96 space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Archive Transcript?
            </h3>

            <p className="text-slate-500 text-sm">
              This transcript will be hidden from active records.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDelete(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mt-6">

        <span className="text-sm text-slate-500">
          Showing {indexOfFirst + 1}–
          {Math.min(indexOfLast, transcripts.length)} of {transcripts.length}
        </span>

        <div className="flex gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === 1
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "hover:bg-slate-100"
            }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === i + 1
                  ? "bg-blue-800 text-white"
                  : "hover:bg-slate-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === totalPages
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "hover:bg-slate-100"
            }`}
          >
            Next
          </button>

        </div>
      </div>
    </div>
  );
};

export default AdminTranscripts;