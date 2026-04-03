import { useState, useEffect } from "react";
import { Activity, ShieldCheck, Info } from "lucide-react";
import HeroSection from "../../components/verifier/HeroSection";
import SearchBar from "../../components/verifier/SearchBar";
import VerifyResultCard from "../../components/verifier/VerifyResultCard";
import VerifySkeleton from "../../components/verifier/VerifySkeleton";
import NavBar from "../../components/verifier/NavBar";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import { Share2 } from "lucide-react";

const PublicVerify = () => {

  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setInputId(id);
      handleSearch(id);
    }
  }, [id]);

  const handleSearch = async (customId) => {

    const verifyId = (customId || inputId)?.trim();
    if (!verifyId) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.get(
        `/api/v1/transcripts/public/verify/${verifyId}`
      );
      setResult(res.data);
    } catch (err) {
      setError("Transcript not found or verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-slate-100 relative overflow-hidden">

      <NavBar />

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <HeroSection />
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="mt-6 lg:col-span-2 space-y-6">

          <SearchBar
            id={inputId}
            setId={setInputId}
            onSearch={handleSearch}
            loading={loading}
          />

          {loading && <VerifySkeleton />}

          {error && (
            <div className="text-red-600">{error}</div>
          )}

          {result && <VerifyResultCard data={result} />}

          {/* EMPTY STATE  */}
          {!result && !loading && !error && (
            <div className="relative mt-10 flex flex-col items-center">

              {/* TEXT just below search */}
              <p className="text-lg text-slate-400 mb-6">
                Enter a Transcript ID to verify authenticity
              </p>

              {/* IMAGE */}
              <div className="mt-10 relative flex justify-center items-center">

                {/* Glow background */}
                <div className="absolute w-[600px] h-[600px] bg-indigo-300 opacity-20 blur-[140px] rounded-full"></div>

                {/* Image */}
                <img
                  src="/verify-illustration.svg"
                  alt="Verification Illustration"
                  className="relative w-[420px] md:w-[560px] object-contain opacity-95"
                  style={{
                    WebkitMaskImage:
                      "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
                    maskImage:
                      "radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)"
                  }}
                />

              </div>

            </div>
          )}

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* SYSTEM STATUS */}
          <div className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-xl transition">
            <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
              <Activity size={16} /> System Status
            </h3>

            <p className="text-green-600 text-sm font-medium">
              ● Blockchain Connected
            </p>

            <p className="text-slate-500 text-sm mt-2">
              All verification requests are securely validated using blockchain.
            </p>
          </div>

          {/* HOW IT WORKS */}
          <div className="bg-white rounded-2xl shadow-md p-5 border hover:shadow-xl transition">
            <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
              <Info size={16} /> How it Works
            </h3>

            <ul className="text-sm text-slate-600 space-y-2">
              <li>1. Enter Transcript ID</li>
              <li>2. Fetch blockchain hash</li>
              <li>3. Compare with live data</li>
              <li>4. Display verification result</li>
            </ul>
          </div>

          {/* TRUST */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 hover:shadow-xl transition">
            <h3 className="flex items-center gap-2 font-semibold text-indigo-700 mb-2">
              <ShieldCheck size={16} /> Secure & Trusted
            </h3>

            <p className="text-sm text-indigo-600">
              Blockchain prevents tampering and ensures authenticity.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicVerify;