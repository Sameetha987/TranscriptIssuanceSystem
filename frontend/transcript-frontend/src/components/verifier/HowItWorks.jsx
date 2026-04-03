const steps = [
  "Enter Transcript ID",
  "System fetches blockchain data",
  "Instant verification result"
];

const HowItWorks = () => {
  return (
    <div className="mt-16 text-center space-y-6">

      <h2 className="text-2xl font-bold text-slate-800">
        How It Works
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {steps.map((step, i) => (
          <div key={i} className="p-6 bg-slate-50 rounded-xl border">
            <div className="text-indigo-600 font-bold text-lg mb-2">
              {i + 1}
            </div>
            <p className="text-slate-700">{step}</p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default HowItWorks;