import { CheckCircle, AlertTriangle, ShieldX, Clock } from "lucide-react";

const VerifyStatusBadge = ({ status }) => {

  const config = {
    VERIFIED: {
      label: "Verified",
      icon: <CheckCircle size={16} />,
      style: "bg-green-100 text-green-700 border-green-200"
    },
    TAMPERED: {
      label: "Tampered",
      icon: <AlertTriangle size={16} />,
      style: "bg-red-100 text-red-700 border-red-200"
    },
    BLOCKCHAIN_ERROR: {
      label: "Blockchain Error",
      icon: <ShieldX size={16} />,
      style: "bg-slate-200 text-slate-700 border-slate-300"
    },
    PENDING: {
      label: "Pending",
      icon: <Clock size={16} />,
      style: "bg-yellow-100 text-yellow-700 border-yellow-200"
    }
  };

  const item = config[status] || config.PENDING;

  return (
    <span className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full border ${item.style}`}>
      {item.icon}
      {item.label}
    </span>
  );
};

export default VerifyStatusBadge;