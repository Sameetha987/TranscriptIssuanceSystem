const StatusBadge = ({ status, time }) => {

  const styles = {
    VERIFIED: "bg-green-100 text-green-700 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    TAMPERED: "bg-red-100 text-red-700 border-red-200",
    BLOCKCHAIN_ERROR: "bg-slate-200 text-slate-700 border-slate-300"
  };

  const labelMap = {
    VERIFIED: "Verified",
    PENDING: "Pending",
    TAMPERED: "Tampered",
    BLOCKCHAIN_ERROR: "Blockchain Error"
  };

  return (
    <div className="flex flex-col gap-1">

      <span
        className={`px-4 py-1.5 text-xs font-semibold rounded-full border tracking-wide w-fit
        ${styles[status] || styles.PENDING}`}
      >
        {labelMap[status] || "Pending"}
      </span>

      {time && (
        <span className="text-xs text-slate-400">
          Verified {time}
        </span>
      )}

    </div>
  );
};

export default StatusBadge;