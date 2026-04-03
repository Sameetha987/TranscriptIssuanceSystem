import { useState } from "react";
import HeroSection from "../../components/verifier/HeroSection";
import SearchBar from "../../components/verifier/SearchBar";
import VerifyResultCard from "../../components/verifier/VerifyResultCard";
import axios from "../../../api/axios";

const PublicVerify = () => {

  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {

    if (!id) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.get(
        `/api/v1/transcripts/public/verify/${id}`
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

        <HeroSection />

        <SearchBar
          id={id}
          setId={setId}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* ERROR */}
        {error && (
          <div className="mt-6 text-center text-red-600">
            {error}
          </div>
        )}

        {result && (
          <VerifyResultCard data={result} />
        )}

      </div>

    </div>
  );
};

export default PublicVerify;