import { useEffect, useState } from "react";
import axios from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Pagination from "../../components/Pagination";

const AdminTranscripts = () => {

  const [transcripts, setTranscripts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const recordsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [verificationMap, setVerificationMap] = useState({});
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

    const downloadPdf = async (id) => {
      try {

        const response = await axios.get(
          `/api/v1/transcripts/${id}/pdf`,
          {
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `transcript-${id}.pdf`);

        document.body.appendChild(link);
        link.click();
        link.remove();

      } catch (error) {
        console.error("PDF download failed:", error);
      }
    };

  const reVerify = async (id) => {
    try {
      const res = await axios.get(`/api/v1/transcripts/verify/${id}`);
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
      setLoading(true);
      const response = await axios.get(
        `/api/v1/transcripts?page=${currentPage - 1}&size=5`
      );
      // Backend returns Page object
      const list = response.data.content;

      setTranscripts(list);
      setTotalPages(response.data.totalPages);

      const verificationResults = {};

      const results = await Promise.all(
        list.map(async (t) => {
          try {
            const res = await axios.get(`/api/v1/transcripts/verify/${t.id}`);
            return { id: t.id, status: res.data.data.status };
          } catch {
            return { id: t.id, status: "BLOCKCHAIN_ERROR" };
          }
        })
      );

      const map = {};
      results.forEach(r => map[r.id] = r.status);

      setVerificationMap(map);

    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };
  useEffect(() => {
    fetchTranscripts();
  }, [currentPage]);

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
    try {
      await axios.delete(`/api/v1/transcripts/${id}`);

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
            Total: <span className="font-semibold text-slate-800">{totalCount}</span>
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
            {transcripts.map((t) => (
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
                        onClick={() => setDeleteId(t.id)}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      </div>
  );
};

export default AdminTranscripts;