import StatusBadge from "./StatusBadge";

const TranscriptRow = ({
  t,
  verificationMap,
  downloadPdf,
  reVerify,
  navigate,
  setDeleteId
}) => {

  return (
    <tr className="border-t hover:bg-slate-50 transition">

      <td className="px-6 py-5 font-semibold text-slate-800">
        #{t.id}
      </td>

      <td className="px-6 py-5">
        <div className="font-semibold text-slate-800">
          {t.student?.name}
        </div>
        <div className="text-sm text-slate-500">
          {t.student?.studentRoll}
        </div>
      </td>

      <td className="px-6 py-5 font-medium text-slate-700">
        {t.semester}
      </td>

      <td className="px-6 py-5 font-semibold text-blue-800">
        {t.cgpa}
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={verificationMap[t.id]} />
      </td>

      <td className="px-6 py-5">
        <div className="flex gap-2">

          <button
            onClick={() => downloadPdf(t.id)}
            className="px-3 py-2 text-sm bg-blue-800 text-white rounded-lg"
          >
            PDF
          </button>

          <button
            onClick={() => reVerify(t.id)}
            className="px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg"
          >
            Re-Verify
          </button>

          <button
            onClick={() => navigate(`/admin/transcripts/${t.id}`)}
            className="px-3 py-2 text-sm bg-slate-800 text-white rounded-lg"
          >
            View
          </button>

          <button
            onClick={() => setDeleteId(t.id)}
            className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>

        </div>
      </td>

    </tr>
  );
};

export default TranscriptRow;