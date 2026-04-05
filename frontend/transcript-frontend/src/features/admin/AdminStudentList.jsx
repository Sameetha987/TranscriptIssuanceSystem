import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Eye, MoreVertical, Key, Trash2, Archive } from "lucide-react";
import Pagination from "../../components/admin/Pagination";
import { useNotification } from "../../components/notifications/NotificationContext";

const AdminStudentList = () => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { showNotification } = useNotification();
  const [openMenuId, setOpenMenuId] = useState(null);
  const fieldMap = {
    roll: "studentRoll",
    name: "name"
  };

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const navigate = useNavigate();
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const [resetStudentId, setResetStudentId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [archiveId, setArchiveId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const fieldMap = {
        roll: "studentRoll",
        name: "name"
      };

      const backendField = fieldMap[sortField] || "studentRoll";

      const res = await axios.get(
        `/api/v1/admin/students?page=${currentPage - 1}&size=5&sort=${backendField},${sortDirection}`
      );

      setStudents(res.data.content);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage, sortField, sortDirection]);

  useEffect(() => {
    const close = () => setOpenMenuId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleResetPassword = async () => {
    try {
      setResetLoading(true);

      await axios.put(
        `/api/v1/admin/students/${resetStudentId}/reset-password`,
        {
          newPassword
        }
      );

      showNotification("success","Password reset successfully");

      setResetStudentId(null);
      setNewPassword("");

    } catch (err) {
      showNotification("error","Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.put(`/api/v1/admin/students/${id}/archive`);

      showNotification("success","Student archived successfully");
      setArchiveId(null);
      fetchStudents();

    } catch {
      showNotification("error","Failed to archive student");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/admin/students/${deleteId}`);

      showNotification("success","Student deleted successfully");

      setDeleteId(null);
      fetchStudents(); // refresh list

    } catch (err) {
      showNotification("error","Failed to delete student");
    }
  };

  const handleSort = (field) => {

    const direction =
      sortField === field && sortDirection === "asc"
        ? "desc"
        : "asc";

    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          Student Management
        </h1>
        <p className="text-slate-500 mt-2">
          Manage and monitor registered students
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border overflow-visible">

        <div className="overflow-visible">
        <div className="rounded-2xl overflow-hidden border shadow-lg">
          <table className="w-full text-left">

            {/* HEADER */}
            <thead className="bg-slate-900 text-white text-sm uppercase tracking-wide">
              <tr className=" overflow-hidden">

                <th
                  onClick={() => handleSort("roll")}
                  className="px-6 py-5 cursor-pointer rounded-tl-2xl text-left"
                >
                  <div className="flex items-center gap-2">
                    ROLL NUMBER
                    <ArrowUpDown size={14} />
                  </div>
                </th>

                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    NAME
                    <ArrowUpDown size={14} />
                  </div>
                </th>

                <th className="px-6 py-5">EMAIL</th>
                <th className="px-6 py-5">DEPARTMENT</th>
                <th className="px-6 py-5 ">ACTIONS</th>

              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-t hover:bg-slate-50 transition"
                >

                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {s.studentRoll}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {s.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {s.email}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    {s.department}
                  </td>

                  <td className="px-6 py-4 relative">

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() => navigate(`/admin/students/${s.id}`)}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <div className="relative">

                        <button
                          onClick={(e) => {
                              e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({ x: rect.right, y: rect.bottom });
                            setOpenMenuId(openMenuId === s.id ? null : s.id);
                          }}
                          className="p-2 rounded-lg hover:bg-slate-100"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenuId === s.id && (
                          <div
                            className="fixed w-48 bg-white shadow-2xl border rounded-xl z-[9999] backdrop-blur-md border-slate-200 animate-in fade-in zoom-in-95"
                            style={{
                              top: menuPosition.y + 6,
                              left: Math.min(menuPosition.x - 180, window.innerWidth - 200)
                            }}
                          >
                            <button
                              onClick={() => {
                                setResetStudentId(s.id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100"
                            >
                              <Key size={16} />
                              Reset Password
                            </button>
                            <button
                              onClick={() => {
                                setArchiveId(s.id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100"
                            >
                              <Archive size={16} />
                              Archive
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(s.id);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}

                      </div>

                    </div>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
          </div>

        </div>

      </div>
      {resetStudentId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              Reset Student Password
            </h2>

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg mb-4"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setResetStudentId(null)}
                className="px-4 py-2 rounded-lg bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </button>

            </div>

          </div>

        </div>
      )}
      {archiveId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-lg w-96">

            <h3 className="text-lg font-semibold mb-3">
              Archive Student
            </h3>

            <p className="text-slate-600 mb-5">
              This student will be hidden from active list.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setArchiveId(null)}
                className="px-4 py-2 bg-slate-200 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleArchive(archiveId)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg"
              >
                Archive
              </button>

            </div>

          </div>

        </div>
      )}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-3 text-red-600">
              Delete Student
            </h2>

            <p className="text-slate-600 mb-6">
              This action cannot be undone. Are you sure?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-slate-200"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

    </div>
  );
};

export default AdminStudentList;