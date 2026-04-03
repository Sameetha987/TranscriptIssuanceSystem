import { useState, useEffect } from "react";
import HeroSection from "../../components/verifier/HeroSection";
import SearchBar from "../../components/verifier/SearchBar";
import VerifyResultCard from "../../components/verifier/VerifyResultCard";
import VerifySkeleton from "../../components/verifier/VerifySkeleton";
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

    const verifyId = customId || inputId;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-4">

      <div className="w-full max-w-2xl">

        {/* HEADER */}
        <div className="text-center mb-6 space-y-2">

          <h1 className="text-2xl font-bold text-slate-800">
            Public Transcript Verification
          </h1>

          {result && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/verify/${result.transcriptId}`
                );
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 1500);
              }}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition"
            >
              <Share2 size={16} />
              {linkCopied ? "Link Copied" : "Share Verification Link"}
            </button>
          )}

        </div>

        {loading && <VerifySkeleton />}

        <HeroSection />

        <SearchBar
          id={inputId}
          setId={setInputId}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* ERROR */}
        {error && (
          <div className="mt-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* RESULT */}
        {result && (
          <VerifyResultCard data={result} />
        )}

      </div>

    </div>
  );
};

export default PublicVerify;