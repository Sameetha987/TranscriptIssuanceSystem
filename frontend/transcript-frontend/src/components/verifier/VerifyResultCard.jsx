import VerifyStatusBadge from "./VerifyStatusBadge";
import { Mail, Hash, QrCode } from "lucide-react";

const VerifyResultCard = ({ data }) => {

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl border p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold text-slate-800">
          Verification Result
        </h2>

        <VerifyStatusBadge status={data.status} />
      </div>

      {/* STUDENT INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border">
          <Mail className="text-indigo-600" size={18} />
          <div>
            <p className="text-xs text-slate-500">Student Email</p>
            <p className="text-sm font-medium text-slate-800">
              {data.studentEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border">
          <Hash className="text-indigo-600" size={18} />
          <div>
            <p className="text-xs text-slate-500">Transcript ID</p>
            <p className="text-sm font-medium text-slate-800">
              {data.transcriptId}
            </p>
          </div>
        </div>

      </div>

      {/* QR CODE */}
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