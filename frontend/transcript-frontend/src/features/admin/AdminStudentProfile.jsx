import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const AdminStudentProfile = () => {

  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    fetchStudent();
    fetchTranscripts();
  }, []);

  const fetchStudent = async () => {
    const res = await axios.get(`/api/admin/students/${id}`);
    setStudent(res.data.data);
  };

  const fetchTranscripts = async () => {
    const res = await axios.get(`/api/transcripts/student/${id}`);
    setTranscripts(res.data);
  };

  if (!student) return null;

  return (
    <div className="space-y-8">

      {/* STUDENT HEADER CARD */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold">{student.name}</h2>
        <p className="text-blue-200 mt-2">
          Roll: {student.studentRoll}
        </p>
        <p className="text-blue-200">
          {student.email}
        </p>
        <p className="text-blue-200">
          Department: {student.department}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-800 p-6">
          <p className="text-slate-500 text-sm">Total Transcripts</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {transcripts.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md border-l-4 border-green-600 p-6">
          <p className="text-slate-500 text-sm">Authentic</p>
          <h2 className="text-3xl font-bold text-green-700 mt-2">
            {transcripts.filter(t => t.blockchainRecordId).length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md border-l-4 border-red-600 p-6">
          <p className="text-slate-500 text-sm">Pending / Failed</p>
          <h2 className="text-3xl font-bold text-red-700 mt-2">
            {transcripts.filter(t => !t.blockchainRecordId).length}
          </h2>
        </div>

      </div>

      {/* TRANSCRIPT CARDS */}
      <div className="space-y-4">

        {transcripts.map(t => (
          <div key={t.id}
               className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition">

            <div className="flex justify-between items-center">

              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Semester {t.semester}
                </h3>
                <p className="text-slate-500">
                  CGPA: {t.cgpa}
                </p>
              </div>

              <div className="flex gap-3 items-center">

                {t.blockchainRecordId ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    VERIFIED
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                    PENDING
                  </span>
                )}

                <button
                  onClick={() => window.open(
                    `http://localhost:8080/api/transcripts/${t.id}/pdf`,
                    "_blank"
                  )}
                  className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
                >
                  PDF
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminStudentProfile;