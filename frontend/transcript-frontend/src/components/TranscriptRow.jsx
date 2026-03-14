import StatusBadge from "./StatusBadge";
import { FileDown, RefreshCcw, Eye, Trash2, MoreVertical} from "lucide-react";

const TranscriptRow = ({
  t,
  verificationMap,
  downloadPdf,
  reVerify,
  navigate,
  setDeleteId,
  openMenuId,
  setOpenMenuId
}) => {
  const status =
    verificationMap[t.id] || t.verificationStatus || "PENDING";
  return (
    <tr className="border-t hover:bg-slate-50 transition cursor-pointer">

      <td className="px-6 py-4">
        <span className="font-semibold text-slate-800">
          {t.student?.studentRoll}
        </span>
      </td>

      <td className="px-6 py-4 font-semibold text-slate-800">
        {t.student?.name}
      </td>

      <td className="px-6 py-4 font-medium text-slate-700">
        {t.semester}
      </td>

      <td className="px-6 py-4 font-semibold text-blue-800">
        {t.cgpa}
      </td>

      <td className="px-6 py-4">

        <div className="flex flex-col">

          <StatusBadge
            status={status}
            time={t.lastVerifiedAt ? new Date(t.lastVerifiedAt).toLocaleString() : null}
          />

        </div>

      </td>

      <td className="px-6 py-4 relative">
        <div className="flex items-center gap-2">

          <button
            onClick={() => navigate(`/admin/transcripts/${t.id}`)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Eye size={16}/>
            View
          </button>

          <div className="relative" onClick={(e) => e.stopPropagation()}>

            <button
              onClick={() =>
                setOpenMenuId(openMenuId === t.id ? null : t.id)
              }
              className="p-2 rounded-lg hover:bg-slate-100 "
            >
              <MoreVertical size={18} />
            </button>

            {openMenuId === t.id && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-lg z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    downloadPdf(t.id);
                    setMenuOpenId(null);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100"
                >
                  <FileDown size={16}/>
                  Download PDF
                </button>

                <button
                  onClick={() => {
                    reVerify(t.id);
                    setMenuOpenId(null);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100"
                >
                  <RefreshCcw size={16}/>
                  Re-Verify
                </button>

                <button
                  onClick={() => {
                    setDeleteId(t.id);
                    setMenuOpenId(null);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16}/>
                  Delete
                </button>

              </div>
            )}

          </div>

        </div>
      </td>

    </tr>
  );
};

export default TranscriptRow;