import { useState } from "react";
import axios from "../../api/axios";

const IssueTranscript = () => {

  const [form, setForm] = useState({
    studentId: "",
    studentEmail: "",
    studentName: "",
    program: "",
    department: "",
    semester: "",
    cgpa: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/transcripts/issue", form);
      setResult(response.data.data);
    } catch (error) {
      alert("Failed to issue transcript");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Issue Transcript
        </h1>
        <p className="text-slate-500 mt-1">
          Create and register a new blockchain-backed transcript
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input name="studentId" placeholder="Student ID"
            className="p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input name="studentEmail" placeholder="Student Email"
            className="p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input name="studentName" placeholder="Student Name"
            className="p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input name="program" placeholder="Program"
            className="p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input name="department" placeholder="Department"
            className="p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input name="semester" placeholder="Semester"
            className="p-3 border rounded-lg"
            onChange={handleChange}
          />

          <input name="cgpa" placeholder="CGPA"
            className="p-3 border rounded-lg"
            onChange={handleChange}
          />

        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg transition"
        >
          {loading ? "Processing..." : "Issue Transcript"}
        </button>

      </div>

      {/* Blockchain Result Panel */}
      {result && (
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-emerald-700 mb-4">
            Transcript Issued Successfully
          </h2>

          <p><strong>Transcript ID:</strong> {result.id}</p>
          <p><strong>Blockchain Record ID:</strong> {result.blockchainRecordId}</p>
          <p><strong>Transaction Hash:</strong> {result.blockchainTxId}</p>

        </div>
      )}

    </div>
  );
};

export default IssueTranscript;