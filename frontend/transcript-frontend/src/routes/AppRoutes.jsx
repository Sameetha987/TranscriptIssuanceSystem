import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "../features/admin/AdminLogin";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminTranscripts from "../features/admin/AdminTranscripts";
import IssueTranscript from "../features/admin/IssueTranscript";

const Dashboard = () => {
  return (
    <div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of transcript issuance and verification
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-blue-800 p-6">
          <p className="text-slate-500 text-sm">Total Transcripts</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">124</h2>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-emerald-600 p-6">
          <p className="text-slate-500 text-sm">Verified Records</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">118</h2>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-indigo-700 p-6">
          <p className="text-slate-500 text-sm">Blockchain Records</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">120</h2>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 border-l-4 border-red-500 p-6">
          <p className="text-slate-500 text-sm">Failed Transactions</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">2</h2>
        </div>

      </div>

    </div>
  );
};
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="issue" element={<IssueTranscript />} />
          <Route path="transcripts" element={<AdminTranscripts />} />
        </Route>

        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;