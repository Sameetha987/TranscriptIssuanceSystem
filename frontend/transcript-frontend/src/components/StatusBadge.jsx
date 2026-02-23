const StatusBadge = ({ status }) => {

  const base = "px-3 py-1 text-xs font-medium rounded-full";

  if (status === "AUTHENTIC") {
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700`}>
        Verified
      </span>
    );
  }

  if (status === "TAMPERED") {
    return (
      <span className={`${base} bg-red-100 text-red-600`}>
        Tampered
      </span>
    );
  }

  return (
    <span className={`${base} bg-gray-100 text-gray-600`}>
      Pending
    </span>
  );
};

export default StatusBadge;