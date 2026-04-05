import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { motion } from "framer-motion";
import CgpaAnalytics from "../../components/student/CgpaAnalytics";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

const StudentDashboard = () => {

  const [student, setStudent] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    tampered: 0,
    cgpa: 0
  });



  const fetchData = async () => {
    try {

      //  Get student profile
      const profileRes = await axios.get("/api/v1/student/profile");

      const transcriptRes = await axios.get("/api/v1/transcripts/my");

      const studentData = profileRes.data.data;
      const transcriptList = transcriptRes.data || [];

      setStudent(studentData);
      setTranscripts(transcriptList);

      //  Calculate stats
      const total = transcriptList.length;

      const verified = transcriptList.filter(
        t => t.blockchainRecordId
      ).length;

      const tampered = transcriptList.filter(
        t => t.verificationStatus === "TAMPERED"
      ).length;

      const latestCgpa =
        transcriptList.length > 0
          ? transcriptList[transcriptList.length - 1].cgpa
          : 0;

      setStats({
        total,
        verified,
        tampered,
        cgpa: latestCgpa
      });

    } catch (err) {
      console.error("Failed to load student dashboard", err);
    }
  };
  useEffect(() => {
      fetchData();
    }, []);


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >

      {/* PROFILE CARD */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition">

        <h2 className="text-2xl font-bold">
          {student?.name || "Student"}
        </h2>

        <p className="text-indigo-100 mt-1">
          {student?.email}
        </p>

        <p className="text-indigo-200 text-sm mt-2">
          Department: {student?.department}
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOTAL */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition flex items-center gap-4">

          <FileText className="text-blue-700" size={28} />

          <div>
            <p className="text-slate-500 text-sm">Total Transcripts</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </div>

        </div>

        {/* VERIFIED */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition flex items-center gap-4">

          <ShieldCheck className="text-green-600" size={28} />

          <div>
            <p className="text-slate-500 text-sm">Verified</p>
            <h2 className="text-2xl font-bold text-green-600">
              {stats.verified}
            </h2>
          </div>

        </div>

        {/* TAMPERED */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition flex items-center gap-4">

          <AlertTriangle className="text-red-600" size={28} />

          <div>
            <p className="text-slate-500 text-sm">Tampered</p>
            <h2 className="text-2xl font-bold text-red-600">
              {stats.tampered}
            </h2>
          </div>

        </div>

        {/* CGPA */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition flex items-center gap-4">

          <TrendingUp className="text-purple-600" size={28} />

          <div>
            <p className="text-slate-500 text-sm">Latest CGPA</p>
            <h2 className="text-2xl font-bold text-purple-600">
              {stats.cgpa}
            </h2>
          </div>

        </div>

      </div>
      <CgpaAnalytics />
      {/* RECENT TRANSCRIPTS */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition">

        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Transcripts
        </h2>

        {transcripts.length === 0 ? (
          <p className="text-slate-500">No transcripts available</p>
        ) : (
          <div className="space-y-4">

            {transcripts.slice(0, 5).map((t) => (

              <div
                key={t.id}
                className="flex justify-between items-center border-b pb-3 hover:bg-slate-50 px-2 py-2 rounded-lg transition"
              >

                <div>
                  <p className="font-medium text-slate-800">
                    Semester {t.semester}
                  </p>
                  <p className="text-sm text-slate-500">
                    CGPA: {t.cgpa}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full
                  ${
                    t.blockchainRecordId
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {t.blockchainRecordId ? "Verified" : "Pending"}
                </span>

              </div>

            ))}

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default StudentDashboard;