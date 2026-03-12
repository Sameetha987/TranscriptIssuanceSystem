import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";
import { FileText, ShieldCheck } from "lucide-react";

const TranscriptDetail = () => {

  const { id } = useParams();

  const [transcript, setTranscript] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState("PENDING");

  useEffect(() => {
    if (!id) return;
    fetchTranscript();
  }, [id]);

  const fetchTranscript = async () => {

    try {

      const tRes = await axios.get(`/api/v1/transcripts/${id}`);
      setTranscript(tRes.data);

      const sRes = await axios.get(`/api/v1/subjects/transcript/${id}`);
      setSubjects(sRes.data);

      const vRes = await axios.get(`/api/v1/transcripts/verify/${id}`);
      setVerificationStatus(vRes.data.data.status);

    } catch (err) {
      console.error("Failed to load transcript", err);
    }

  };

  const downloadPdf = async () => {

    try {

      const response = await axios.get(
        `/api/v1/transcripts/${id}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `transcript-${id}.pdf`);

      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error("PDF download failed", err);
    }

  };

  if (!transcript) {
    return (
      <div className="text-center py-20 text-slate-500">
        Loading transcript...
      </div>
    );
  }

  return (

    <div className="space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-slate-800">
          Transcript #{transcript.id}
        </h1>

        <button
          onClick={downloadPdf}
          className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900"
        >
          <FileText size={18} />
          Download PDF
        </button>

      </div>


      {/* Student Info */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-lg font-semibold mb-4 text-slate-700">
          Student Information
        </h2>

        <div className="grid grid-cols-2 gap-4 text-slate-600">

          <p><strong>Name:</strong> {transcript.studentName}</p>
          <p><strong>Email:</strong> {transcript.studentEmail}</p>
          <p><strong>Program:</strong> {transcript.program}</p>
          <p><strong>Department:</strong> {transcript.department}</p>
          <p><strong>Semester:</strong> {transcript.semester}</p>
          <p><strong>CGPA:</strong> {transcript.cgpa}</p>

        </div>

      </div>


      {/* Subjects */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-lg font-semibold mb-4 text-slate-700">
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


      {/* Blockchain Info */}

      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-lg font-semibold mb-4 text-slate-700 flex items-center gap-2">

          <ShieldCheck size={18} />
          Blockchain Information

        </h2>

        <p><strong>Record ID:</strong> {transcript.blockchainRecordId}</p>
        <p><strong>Transaction ID:</strong> {transcript.blockchainTxId}</p>

        <div className="mt-4">
          <StatusBadge status={verificationStatus} />
        </div>

      </div>

    </div>

  );

};

export default TranscriptDetail;