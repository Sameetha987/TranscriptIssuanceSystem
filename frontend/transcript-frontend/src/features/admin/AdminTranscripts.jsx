import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Pagination from "../../components/Pagination";
import TranscriptSearchBar from "../../components/TranscriptSearchBar";
import TranscriptTable from "../../components/TranscriptTable";
import DeleteTranscriptModal from "../../components/DeleteTranscriptModal";

const AdminTranscripts = () => {

  const [transcripts, setTranscripts] = useState([]);
  const [verificationMap, setVerificationMap] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [filterStatus, setFilterStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const handleSearch = () => {
    setCurrentPage(1);
    setSearch(searchInput);
    console.log("Searching:", searchInput);
  };
  /*
  Fetch Transcripts
  */

  const fetchTranscripts = async () => {

    try {

      setLoading(true);

      let url = `/api/v1/transcripts?page=${currentPage - 1}&size=5`;

      if (search.trim() !== "") {
        url += `&search=${search}`;
      }

      const response = await axios.get(url);

      const list = response.data.content;

      setTranscripts(list);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalElements);

      /*
      Fetch blockchain verification
      */

      const results = await Promise.all(

        list.map(async (t) => {

          try {

            const res = await axios.get(`/api/v1/transcripts/verify/${t.id}`);

            return {
              id: t.id,
              status: res.data.data.status
            };

          } catch {

            return {
              id: t.id,
              status: "BLOCKCHAIN_ERROR"
            };

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
  }, [currentPage, search, filterStatus]);

  /*
  Filter Status
  */

  const filteredTranscripts = transcripts.filter((t) => {

    if (filterStatus === "All") return true;

    const status = verificationMap[t.id];

    return status === filterStatus;

  });

  /*
  Download PDF
  */

  const downloadPdf = async (id) => {

    try {

      const response = await axios.get(`/api/v1/transcripts/${id}/pdf`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `transcript-${id}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {

      console.error("PDF download failed", error);

    }

  };

  /*
  Reverify Transcript
  */

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

  /*
  Delete Transcript
  */

  const handleDelete = async (id) => {

    try {

      await axios.delete(`/api/v1/transcripts/${id}`);

      toast.success("Transcript archived successfully");

      setTranscripts(prev => prev.filter(t => t.id !== id));

    } catch {

      toast.error("Delete failed");

    }

  };

  /*
  Page UI
  */

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
      {/* SEARCH BAR */}

      <TranscriptSearchBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        totalCount={totalCount}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onSearch={handleSearch}
      />

      {/* TABLE */}

      <TranscriptTable
        transcripts={filteredTranscripts}
        verificationMap={verificationMap}
        downloadPdf={downloadPdf}
        reVerify={reVerify}
        navigate={navigate}
        setDeleteId={setDeleteId}
        loading={loading}
      />

      {/* DELETE MODAL */}

      <DeleteTranscriptModal
        deleteId={deleteId}
        setDeleteId={setDeleteId}
        handleDelete={handleDelete}
      />

      {/* PAGINATION */}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </div>

  );

};

export default AdminTranscripts;