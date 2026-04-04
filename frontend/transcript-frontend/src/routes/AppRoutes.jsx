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
import StudentDashboard from "../features/student/StudentDashboard";
import MyTranscripts from "../features/student/MyTranscripts";
import StudentTranscriptDetail from "../features/student/StudentTranscriptDetail";
import StudentLayout from "../layouts/StudentLayout";

import PublicVerify from "../features/verifier/PublicVerify";
import PublicLanding from "../features/verifier/PublicLanding";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLanding />} />
        <Route path="/verify" element={<PublicVerify />} />
        <Route path="/login" element={<AdminLogin />} />

        {/* ADMIN ROUTES */}
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
        </Route>

        {/* STUDENT ROUTES */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="STUDENT">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="transcripts" element={<MyTranscripts />} />
          <Route path="transcripts/:id" element={<StudentTranscriptDetail />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<PublicLanding />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;