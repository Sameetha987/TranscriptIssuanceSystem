const AdminRecentActivity = ({ transcripts }) => {

return (

    <div className="bg-white rounded-xl shadow-md p-6">

    <h2 className="text-lg font-semibold mb-4">
    Recent Activity
    </h2>

    <div className="space-y-4">

    {transcripts.slice(0,5).map((t) => (

    <div key={t.id} className="flex justify-between border-b pb-2">

    <div>

    <p className="font-medium">
    {t.student?.name}
    </p>

    <p className="text-sm text-slate-500">
    Transcript issued
    </p>

    </div>

    <p className="text-sm text-slate-400">
    ID #{t.id}
    </p>

    </div>

    ))}

    </div>

    </div>

    );
    };

export default AdminRecentActivity;