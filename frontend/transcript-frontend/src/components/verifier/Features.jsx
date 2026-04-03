import { Shield, Zap, Database } from "lucide-react";

const features = [
  {
    icon: <Shield size={20} />,
    title: "Tamper Proof",
    desc: "Data secured using blockchain hashing"
  },
  {
    icon: <Zap size={20} />,
    title: "Instant Verification",
    desc: "Verify transcripts in seconds"
  },
  {
    icon: <Database size={20} />,
    title: "Secure Storage",
    desc: "Immutable records stored on-chain"
  }
];

const Features = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-12">

      {features.map((f, i) => (
        <div
          key={i}
          className="bg-white border rounded-xl p-6 shadow hover:shadow-lg transition"
        >
          <div className="text-indigo-600 mb-3">{f.icon}</div>
          <h3 className="font-semibold text-slate-800">{f.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
        </div>
      ))}

    </div>
  );
};

export default Features;