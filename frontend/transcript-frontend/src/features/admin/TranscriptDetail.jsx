import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import StatusBadge from "../../components/StatusBadge";

const TranscriptDetail = () => {

  const { id } = useParams();
  const [transcript, setTranscript] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchTranscript();
  }, []);

  const fetchTranscript = async () => {
    try {
      const tRes = await axios.get(`/api/transcripts/${id}`);
      setTranscript(tRes.data);

      const sRes = await axios.get(`/api/subjects/transcript/${id}`);
      setSubjects(sRes.data);

    } catch (err) {
      console.error("Failed to load transcript");
    }
  };

  if (!transcript) return <p>Loading...</p>;

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Transcript #{transcript.id}
        </h1>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">

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
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">

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
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3">{s.code}</td>
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.credits}</td>
                <td className="px-4 py-3">{s.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* Blockchain Info */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <h2 className="text-lg font-semibold mb-4 text-slate-700">
          Blockchain Information
        </h2>

        <p><strong>Record ID:</strong> {transcript.blockchainRecordId}</p>
        <p><strong>Transaction ID:</strong> {transcript.blockchainTxId}</p>

        <div className="mt-4">
          <StatusBadge status={transcript.blockchainHash ? "AUTHENTIC" : "PENDING"} />
        </div>

      </div>

    </div>
  );
};

export default TranscriptDetail;