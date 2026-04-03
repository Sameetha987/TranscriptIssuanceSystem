import { ShieldCheck } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="text-center mb-10">

      <div className="flex justify-center mb-4">
        <div className="bg-indigo-100 p-4 rounded-2xl shadow">
          <ShieldCheck className="text-indigo-600" size={32} />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-slate-800">
        Transcript Verification
      </h1>

      <p className="text-slate-500 mt-2 text-sm">
        Public blockchain-based verification portal
      </p>

    </div>
  );
};

export default HeroSection;