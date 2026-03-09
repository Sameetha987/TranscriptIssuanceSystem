import TranscriptRow from "./TranscriptRow";

const TranscriptTable = ({
  transcripts,
  verificationMap,
  downloadPdf,
  reVerify,
  navigate,
  setDeleteId
}) => {

  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

      <table className="w-full text-left">

        <thead className="bg-slate-900 text-white text-sm uppercase tracking-wide">
          <tr>
            <th className="px-6 py-5">ID</th>
            <th className="px-6 py-5">Student</th>
            <th className="px-6 py-5">Semester</th>
            <th className="px-6 py-5">CGPA</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transcripts.map((t) => (
            <TranscriptRow
              key={t.id}
              t={t}
              verificationMap={verificationMap}
              downloadPdf={downloadPdf}
              reVerify={reVerify}
              navigate={navigate}
              setDeleteId={setDeleteId}
            />
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default TranscriptTable;