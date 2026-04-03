import { ArrowRight } from "lucide-react";

const CTASection = ({ navigate }) => {
  return (
    <div className="mt-16 text-center bg-indigo-600 text-white p-10 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-bold mb-3">
        Start Verifying Now
      </h2>

      <p className="mb-6 text-indigo-100">
        Ensure authenticity with blockchain-backed verification
      </p>

      <button
        onClick={() => navigate("/verify")}
        className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
      >
        Verify Transcript
        <ArrowRight size={16} />
      </button>

    </div>
  );
};

export default CTASection;