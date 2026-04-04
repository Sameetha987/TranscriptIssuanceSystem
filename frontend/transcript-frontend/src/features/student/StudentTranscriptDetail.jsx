import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
 import { motion } from "framer-motion";
import StatusBadge from "../../components/admin/StatusBadge";
import TranscriptQR from "../../components/student/TranscriptQR";
import BlockchainCard from "../../components/student/BlockchainCard";
import {
  FileDown,
  Copy,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

const StudentTranscriptDetail = () => {

  const { id } = useParams();

  const [transcript, setTranscript] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [status, setStatus] = useState("PENDING");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {

      const tRes = await axios.get(`/api/v1/transcripts/student/${id}`);
      setTranscript(tRes.data.data || tRes.data);

      const sRes = await axios.get(`/api/v1/subjects/transcript/${id}`);
      setSubjects(sRes.data.data || sRes.data);

      const vRes = await axios.get(`/api/v1/transcripts/verify/${id}`);
      setStatus(vRes.data.data.status);

    } catch (err) {
      console.error("Failed to load transcript", err);
    }
  };

  //  DOWNLOAD PDF
  const downloadPdf = async () => {
    try {
      const res = await axios.get(
        `/api/v1/transcripts/student/${id}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transcript-${id}.pdf`);
      document.body.appendChild(link);
      link.click();

    } catch {
      console.error("Download failed");
    }
  };

  //  COPY TX HASH
  const copyTx = () => {
    navigator.clipboard.writeText(transcript.blockchainTxId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!transcript) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const etherscanUrl = `https://sepolia.etherscan.io/tx/${transcript.blockchainTxId}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >

      {/* HEADER */}
      <div className="flex justify-between items-center mb-2">

        <h1 className="text-3xl font-bold text-slate-800">
          Transcript #{transcript.id}
        </h1>

        <button
          onClick={downloadPdf}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <FileDown size={18} />
          Download PDF
        </button>

      </div>

      {/* STUDENT INFO */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">

        <h2 className="text-xl font-bold">
          {transcript.studentName}
        </h2>

        <p className="text-indigo-100">
          {transcript.studentEmail}
        </p>

        <p className="text-indigo-200 text-sm mt-2">
          {transcript.department} • {transcript.program}
        </p>

      </div>

      {/* SUBJECTS */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition">

        <h2 className="text-lg font-semibold mb-4">
          Subjects
        </h2>

        <table className="w-full text-left">

          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Grade</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((s) => (
              <tr key={s.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3">{s.code}</td>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.credits}</td>
                <td className="px-4 py-3 font-semibold">{s.grade}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* BLOCKCHAIN */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 space-y-4 hover:shadow-lg transition">

        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck size={18} />
          Blockchain Verification
        </h2>

        {/* STATUS */}
        <StatusBadge status={status} />

        {/* RECORD */}
        <p>
          <strong>Record ID:</strong> {transcript.blockchainRecordId}
        </p>

        {/* TX HASH */}
        <div className="flex items-center gap-3">

          <p className="truncate max-w-md">
            <strong>Tx:</strong> {transcript.blockchainTxId}
          </p>

          <button onClick={copyTx}>
            <Copy size={16} />
          </button>

          {copied && (
            <span className="text-green-600 text-sm">Copied!</span>
          )}

        </div>

        {/* ETHERSCAN */}
        <a
          href={etherscanUrl}
          target="_blank"
          className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
        >
          View on Etherscan
          <ExternalLink size={16} />
        </a>

      </div>
      <div className="grid md:grid-cols-2 gap-6">

        <BlockchainCard
          status={status}
          txId={transcript.blockchainTxId}
        />

        <TranscriptQR id={transcript.id} />

      </div>

    </motion.div>
  );
};

export default StudentTranscriptDetail;