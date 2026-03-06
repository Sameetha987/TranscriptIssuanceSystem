const StatusBadge = ({ status }) => {

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
    <span
      className={`px-4 py-1.5 text-xs font-semibold rounded-full border tracking-wide ${styles[status] || styles.PENDING}`}
    >
      {labelMap[status] || "Pending"}
    </span>
  );
};

export default StatusBadge;