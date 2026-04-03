import { ShieldCheck, FileCheck2 } from "lucide-react";

const LandingHero = ({ navigate }) => {
  return (
    <div className="text-center space-y-6">

      <div className="flex justify-center">
        <div className="bg-indigo-100 p-4 rounded-full">
          <ShieldCheck className="text-indigo-600" size={32} />
        </div>
      </div>

      <h1 className="text-4xl font-bold text-slate-900 leading-tight">
        Verify Academic Transcripts
        <br />
        <span className="text-indigo-600">Instantly & Securely</span>
      </h1>

      <p className="text-slate-600 max-w-xl mx-auto">
        Blockchain-powered verification system ensuring authenticity,
        integrity, and trust in academic records.
      </p>

      <button
        onClick={() => navigate("/verify")}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition"
      >
        <FileCheck2 size={18} />
        Verify Transcript
      </button>

    </div>
  );
};

export default LandingHero;