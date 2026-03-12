import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { FileText, ShieldCheck, AlertTriangle } from "lucide-react";

const AdminStudentProfile = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`/api/v1/admin/students/${id}`);
      const data = res.data.data;

      setStudent(data);
      setTranscripts(data.transcripts || []);
    } catch (err) {
      console.error("Failed to fetch student", err);
    }
  };

  if (!student) {
    return (
      <div className="flex justify-center py-20 text-slate-500">
        Loading student profile...
      </div>
    );
  }
  const sortedTranscripts = [...transcripts].sort(
    (a, b) => a.semester - b.semester
  );
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

        {/* Total Transcripts */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-blue-700 p-6 flex items-center gap-4">

          <FileText className="text-blue-700" size={28} />

          <div>
            <p className="text-slate-500 text-sm">Total Transcripts</p>
            <h2 className="text-3xl font-bold text-slate-800">
              {transcripts.length}
            </h2>
          </div>

        </div>


        {/* Authentic */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-green-600 p-6 flex items-center gap-4">

          <ShieldCheck className="text-green-600" size={28} />

          <div>
            <p className="text-slate-500 text-sm">Authentic</p>
            <h2 className="text-3xl font-bold text-green-700">
              {transcripts.filter(t => t.blockchainRecordId).length}
            </h2>
          </div>

        </div>


        {/* Pending */}
        <div className="bg-white rounded-xl shadow-md border-l-4 border-red-600 p-6 flex items-center gap-4">

          <AlertTriangle className="text-red-600" size={28} />

          <div>
            <p className="text-slate-500 text-sm">Pending / Failed</p>
            <h2 className="text-3xl font-bold text-red-700">
              {transcripts.filter(t => !t.blockchainRecordId).length}
            </h2>
          </div>

        </div>

      </div>

      {/* TRANSCRIPT CARDS */}
      <h2 className="text-xl font-semibold text-slate-800">
        Academic Progress
      </h2>

      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="relative border-l-2 border-slate-200 ml-3">

          {sortedTranscripts.map((t, index) => (

            <div key={t.id} className="mb-8 ml-6">

              {/* Timeline Dot */}
              <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full
                ${t.blockchainRecordId ? "bg-green-500" : "bg-yellow-500"}`}>
              </span>

              <div className="flex justify-between items-center">

                {/* Semester Info */}
                <div>

                  <h3 className="text-lg font-semibold text-slate-800">
                    Semester {t.semester}
                  </h3>

                  <p className="text-slate-500">
                    CGPA: {t.cgpa}
                  </p>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">

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
                    onClick={() => navigate(`/admin/transcripts/${t.id}`)}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900"
                  >
                    View
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        const res = await axios.get(
                          `/api/v1/transcripts/${t.id}/pdf`,
                          { responseType: "blob" }
                        );

                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `transcript_${t.id}.pdf`);
                        document.body.appendChild(link);
                        link.click();

                      } catch (err) {
                        console.error("Failed to download PDF", err);
                      }
                    }}
                    className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900"
                  >
                    PDF
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>
      </div>
      </div>
  );
};

export default AdminStudentProfile;