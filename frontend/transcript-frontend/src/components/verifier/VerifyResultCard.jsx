import VerifyStatusBadge from "./VerifyStatusBadge";
import { Mail, Hash, QrCode, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const VerifyResultCard = ({ data }) => {

  if (!data) return null;

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(data.transcriptId);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl border p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Verification Result
        </h2>
        <VerifyStatusBadge status={data.status} />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* EMAIL */}
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border">
          <Mail className="text-indigo-600" size={18} />
          <div>
            <p className="text-xs text-slate-500">Student Email</p>
            <p className="text-sm font-medium text-slate-800">
              {data.studentEmail}
            </p>
          </div>
        </div>

        {/* BLOCKCHAIN STATUS */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-600 font-medium">
              Blockchain Status
            </p>

            <p className="text-sm text-slate-800 font-semibold">
              {data.status === "VERIFIED"
                ? "Stored and verified on blockchain"
                : data.status === "TAMPERED"
                ? "Data mismatch detected"
                : "Blockchain verification pending"}
            </p>
          </div>

          {data.status === "VERIFIED" && (
            <CheckCircle2 className="text-green-600" size={20} />
          )}
        </div>

        {/* TRANSCRIPT ID */}
        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border">
          <div className="flex items-center gap-3">
            <Hash className="text-indigo-600" size={18} />
            <div>
              <p className="text-xs text-slate-500">Transcript ID</p>
              <p className="text-sm font-medium text-slate-800">
                {data.transcriptId}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="text-slate-500 hover:text-indigo-600"
          >
            {copied ? <CheckCircle2 size={16}/> : <Copy size={16}/>}
          </button>
        </div>

      </div>

      {/* QR */}
      {data.qrCode && (
        <div className="flex flex-col items-center gap-3 border-t pt-6">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <QrCode size={16} />
            Scan to verify
          </div>

          <img
            src={`data:image/png;base64,${data.qrCode}`}
            alt="QR Code"
            className="w-32 h-32 border rounded-lg"
          />
        </div>
      )}

    </div>
  );
};

export default VerifyResultCard;