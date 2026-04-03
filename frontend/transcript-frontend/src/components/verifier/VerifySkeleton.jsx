const VerifySkeleton = () => {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl border p-6 animate-pulse space-y-6">

      <div className="h-5 w-40 bg-slate-200 rounded"></div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-16 bg-slate-200 rounded-xl"></div>
        <div className="h-16 bg-slate-200 rounded-xl"></div>
      </div>

      <div className="h-32 w-32 mx-auto bg-slate-200 rounded-lg"></div>

    </div>
  );
};

export default VerifySkeleton;