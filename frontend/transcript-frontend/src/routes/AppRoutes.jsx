import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "../features/admin/AdminLogin";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminTranscripts from "../features/admin/AdminTranscripts";
import IssueTranscript from "../features/admin/IssueTranscript";
import Dashboard from "../features/admin/Dashboard";
import TranscriptDetail from "../features/admin/TranscriptDetail";
import AdminCreateStudent from "../features/admin/AdminCreateStudent";
import AdminStudentList from "../features/admin/AdminStudentList";
import AdminStudentProfile from "../features/admin/AdminStudentProfile";
import PublicVerify from "../features/verifier/PublicVerify";

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
          <Route path="students/create" element={<AdminCreateStudent />} />
          <Route path="students" element={<AdminStudentList />} />
          <Route path="students/:id" element={<AdminStudentProfile />} />
          <Route path="issue" element={<IssueTranscript />} />
          <Route path="transcripts" element={<AdminTranscripts />} />
          <Route path="transcripts/:id" element={<TranscriptDetail />} />
          <Route path="/verify" element={<PublicVerify />} />
        </Route>

        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;