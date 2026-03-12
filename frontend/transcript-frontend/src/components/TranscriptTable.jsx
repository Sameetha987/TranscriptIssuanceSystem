import TranscriptRow from "./TranscriptRow";
import { ArrowUpDown } from "lucide-react";
const TranscriptTable = ({
  transcripts,
  verificationMap,
  downloadPdf,
  reVerify,
  navigate,
  setDeleteId,
  handleSort,
  openMenuId,
  setOpenMenuId
}) => {

  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

      <table className="w-full text-left">

        <thead className="bg-slate-900 text-white text-sm uppercase tracking-wide">
          <tr>
            <th
              className="px-6 py-5 cursor-pointer flex items-center gap-2"
              onClick={() => handleSort("roll")}
            >
              ROLL NUMBER
              <ArrowUpDown size={14}/>
            </th>

            <th className="px-6 py-5">
              STUDENT
            </th>

            <th className="px-6 py-5">
              SEMESTER
            </th>

            <th
              className="px-6 py-5 cursor-pointer flex items-center gap-2"
              onClick={() => handleSort("cgpa")}
            >
              CGPA
              <ArrowUpDown size={14}/>
            </th>

            <th className="px-6 py-5">
              STATUS
            </th>
            <th className="px-6 py-5 text-left">
              ACTIONS
            </th>
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
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
            />
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default TranscriptTable;