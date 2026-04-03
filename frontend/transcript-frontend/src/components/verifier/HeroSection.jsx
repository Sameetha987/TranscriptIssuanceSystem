import { ShieldCheck } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="text-center space-y-6 mt-10">

      {/* ICON */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg">

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl blur-xl bg-indigo-400 opacity-30"></div>

        {/* Icon */}
        <ShieldCheck className="text-white relative z-10" size={40} />

      </div>

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
        Public Transcript Verification
      </h1>

      {/* SUBTEXT */}
      <p className="text-slate-500 max-w-2xl mx-auto">
        Secure, tamper-proof verification powered by blockchain technology.
      </p>

    </div>
  );
};

export default HeroSection;