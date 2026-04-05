import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  User,
  Mail,
  GraduationCap,
  Hash,
  ShieldCheck
} from "lucide-react";

const StudentProfile = () => {

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    cgpa: 0
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      //  Get student basic info
      const profileRes = await axios.get("/api/v1/student/profile");

      //  Get transcripts (reuse existing API)
      const transcriptRes = await axios.get("/api/v1/transcripts/my");

      const student = profileRes.data.data;
      const transcripts = transcriptRes.data || [];

      setProfile(student);

      // Stats
      const total = transcripts.length;
      const verified = transcripts.filter(t => t.blockchainRecordId).length;
      const latestCgpa =
        transcripts.length > 0
          ? transcripts[transcripts.length - 1].cgpa
          : 0;

      setStats({
        total,
        verified,
        cgpa: latestCgpa
      });

    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  if (!profile) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Profile
        </h1>
        <p className="text-slate-500">
          Your academic identity and account details
        </p>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition">

        <h2 className="text-2xl font-bold">
          {profile.name}
        </h2>

        <p className="text-indigo-100 mt-1">
          {profile.email}
        </p>

        <p className="text-indigo-200 text-sm mt-2">
          {profile.department}
        </p>

      </div>

      {/* DETAILS GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PERSONAL INFO */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition space-y-4">

          <h2 className="font-semibold text-lg text-slate-800">
            Personal Info
          </h2>

          <div className="flex items-center gap-3">
            <User size={18} />
            <span>{profile.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={18} />
            <span>{profile.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Hash size={18} />
            <span>{profile.studentRoll}</span>
          </div>

          <div className="flex items-center gap-3">
            <GraduationCap size={18} />
            <span>{profile.department}</span>
          </div>

        </div>

        {/* ACCOUNT */}
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition space-y-4">

          <h2 className="font-semibold text-lg text-slate-800">
            Account
          </h2>

          <div className="flex items-center gap-3">
            <ShieldCheck size={18} />
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              STUDENT
            </span>
          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition text-center">
          <p className="text-slate-500 text-sm">Total Transcripts</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition text-center">
          <p className="text-slate-500 text-sm">Verified</p>
          <h2 className="text-2xl font-bold text-green-600">
            {stats.verified}
          </h2>
        </div>

        <div className="bbg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md p-6 hover:shadow-lg transition text-center">
          <p className="text-slate-500 text-sm">Latest CGPA</p>
          <h2 className="text-2xl font-bold text-indigo-600">
            {stats.cgpa}
          </h2>
        </div>

      </div>

    </div>
  );
};

export default StudentProfile;