import StatusBadge from "../../components/StatusBadge";

const AdminTranscripts = () => {

  // Temporary dummy data
  const transcripts = [
    { id: 1, student: "John Doe", semester: 5, cgpa: 8.4, status: "AUTHENTIC" },
    { id: 2, student: "Alice Smith", semester: 6, cgpa: 9.1, status: "AUTHENTIC" },
    { id: 3, student: "Robert Lee", semester: 4, cgpa: 7.8, status: "TAMPERED" },
  ];

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Transcripts
        </h1>
        <p className="text-slate-500 mt-1">
          Manage and verify issued transcripts
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-slate-100 text-slate-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Semester</th>
              <th className="px-6 py-4">CGPA</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {transcripts.map((t) => (
              <tr
                key={t.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  #{t.id}
                </td>
                <td className="px-6 py-4">{t.student}</td>
                <td className="px-6 py-4">{t.semester}</td>
                <td className="px-6 py-4">{t.cgpa}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminTranscripts;