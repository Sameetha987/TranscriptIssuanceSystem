import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "../features/admin/AdminLogin";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminTranscripts from "../features/admin/AdminTranscripts";
import IssueTranscript from "../features/admin/IssueTranscript";
import Dashboard from "../features/admin/Dashboard";
import TranscriptDetail from "../features/admin/TranscriptDetail";

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
          <Route path="transcripts/:id" element={<TranscriptDetail />} />
        </Route>

        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;