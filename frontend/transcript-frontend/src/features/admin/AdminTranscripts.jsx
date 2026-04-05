import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../components/notifications/NotificationContext";

import Pagination from "../../components/admin/Pagination";
import TranscriptSearchBar from "../../components/admin/TranscriptSearchBar";
import TranscriptTable from "../../components/admin/TranscriptTable";
import DeleteTranscriptModal from "../../components/admin/DeleteTranscriptModal";
import TranscriptRow from "../../components/admin/TranscriptRow";
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
  const [verifyingId, setVerifyingId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [openMenuId, setOpenMenuId] = useState(null);
  const { showNotification } = useNotification();
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
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

      const fieldMap = {
        roll: "studentRoll",
        name: "studentName",
        cgpa: "cgpa"
      };

      const backendField = fieldMap[sortField] || "id";

      let url = `/api/v1/transcripts?page=${currentPage - 1}&size=5&sort=${backendField},${sortDirection}`;

      if (search.trim() !== "") {
        url += `&search=${search}`;
      }

      const response = await axios.get(url);

      const list = response.data.content;

      setTranscripts(list);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalElements);

      const map = {};

      list.forEach(r => map[r.id] = r.verificationStatus);

      setVerificationMap(map);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchTranscripts();
  }, [currentPage, search, filterStatus, sortField, sortDirection]);

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

     setVerifyingId(id);

     const res = await axios.get(`/api/v1/transcripts/reverify/${id}`);

     const status = res.data.status;

     // update verificationMap
     setVerificationMap(prev => ({
       ...prev,
       [id]: status
     }));

     // update transcript row status
     setTranscripts(prev =>
       prev.map(t =>
         t.id === id
           ? { ...t, verificationStatus: status, lastVerifiedAt: new Date().toISOString() }
           : t
       )
     );

     showNotification("success","Verification updated");

   } catch {
     showNotification("error","Verification failed");
   } finally {
     setVerifyingId(null);
   }
 };

  /*
  Delete Transcript
  */

  const handleDelete = async (id) => {

    try {

      await axios.delete(`/api/v1/transcripts/${id}`);

      showNotification("success","Transcript archived successfully");

      setTranscripts(prev => prev.filter(t => t.id !== id));

    } catch {

      showNotification("error","Delete failed");

    }

  };
  const handleSort = (field) => {

    const direction =
      sortField === field && sortDirection === "asc"
        ? "desc"
        : "asc";

    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1);
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
        handleSort={handleSort}
        loading={loading}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
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