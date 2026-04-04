import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileDown,
  Eye,
  RefreshCcw,
  Filter
} from "lucide-react";

import StatusBadge from "../../components/admin/StatusBadge";

const MyTranscripts = () => {

  const [transcripts, setTranscripts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTranscripts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filter, transcripts]);

  const fetchTranscripts = async () => {
    try {
      const res = await axios.get("/api/v1/student/transcripts");
      const data = res.data.data || [];
      setTranscripts(data);
      setFiltered(data);
    } catch (err) {
      console.error("Failed to fetch transcripts", err);
    }
  };

  const applyFilters = () => {
    let list = [...transcripts];

    // 🔍 SEARCH (by semester or ID)
    if (search) {
      list = list.filter(t =>
        t.id.toString().includes(search) ||
        t.semester.toString().includes(search)
      );
    }

    // 🎛️ FILTER
    if (filter !== "All") {
      list = list.filter(t => {
        if (filter === "VERIFIED") return t.blockchainRecordId;
        if (filter === "PENDING") return !t.blockchainRecordId;
        return true;
      });
    }

    setFiltered(list);
  };

  // 📥 DOWNLOAD PDF
  const downloadPdf = async (id) => {
    try {
      const res = await axios.get(`/api/v1/transcripts/${id}/pdf`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transcript-${id}.pdf`);
      document.body.appendChild(link);
      link.click();

    } catch {
      console.error("PDF download failed");
    }
  };

  // 🔄 REVERIFY
  const reVerify = async (id) => {
    try {
      await axios.get(`/api/v1/transcripts/reverify/${id}`);
      fetchTranscripts();
    } catch {
      console.error("Reverify failed");
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Transcripts
        </h1>
        <p className="text-slate-500 mt-1">
          View and verify your academic records
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white p-6 rounded-2xl shadow border flex flex-col md:flex-row justify-between gap-4">

        {/* SEARCH */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />

          <input
            type="text"
            placeholder="Search by ID or semester..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl bg-slate-50 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* FILTER */}
        <div className="flex items-center gap-2 border px-3 py-2 rounded-xl">
          <Filter size={16} className="text-slate-500" />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="outline-none bg-transparent"
          >
            <option value="All">All</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-900 text-white text-sm uppercase">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4">CGPA</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filtered.map((t) => {

              const status = t.blockchainRecordId
                ? "VERIFIED"
                : "PENDING";

              return (
                <tr
                  key={t.id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="px-6 py-4 font-semibold">
                    #{t.id}
                  </td>

                  <td className="px-6 py-4">
                    Semester {t.semester}
                  </td>

                  <td className="px-6 py-4 text-blue-700 font-semibold">
                    {t.cgpa}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={status} />
                  </td>

                  <td className="px-6 py-4 flex gap-2">

                    {/* VIEW */}
                    <button
                      onClick={() => navigate(`/student/transcripts/${t.id}`)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    {/* PDF */}
                    <button
                      onClick={() => downloadPdf(t.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FileDown size={16} />
                    </button>

                    {/* REVERIFY */}
                    <button
                      onClick={() => reVerify(t.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      <RefreshCcw size={16} />
                    </button>

                  </td>

                </tr>
              );

            })}

          </tbody>

        </table>

      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="text-center text-slate-500">
          No transcripts found
        </div>
      )}

    </div>
  );
};

export default MyTranscripts;