import { FileText, ShieldCheck } from "lucide-react";

const AdminRecentActivity = ({ transcripts }) => {

  if (!transcripts || transcripts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          Recent Activity
        </h2>
        <p className="text-slate-500">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {transcripts.map((t) => (

          <div
            key={t.id}
            className="flex items-center gap-3 border-b pb-3 hover:bg-slate-50 rounded-lg px-2 py-2 transition"
          >

            <FileText className="text-blue-600" size={20} />

            <div className="text-sm text-slate-700">
              Transcript #{t.id} issued for
              <span className="font-semibold ml-1">
                {t.student?.name || t.studentName}
              </span>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default AdminRecentActivity;