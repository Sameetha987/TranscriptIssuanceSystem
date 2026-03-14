import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Edit, Archive, Trash2, KeyRound, Eye } from "lucide-react";

const AdminStudentList = () => {

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [search, departmentFilter, students]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/v1/admin/students/all");
      setStudents(res.data.data);
      setFilteredStudents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {

    let list = [...students];

    if (search) {
      list = list.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.studentRoll.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (departmentFilter) {
      list = list.filter((s) => s.department === departmentFilter);
    }

    setFilteredStudents(list);
  };

  const uniqueDepartments = [...new Set(students.map(s => s.department))];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">

      <h2 className="text-2xl font-bold text-slate-800">
        Students
      </h2>

      {/* SEARCH + FILTER */}
      <div className="flex gap-4 items-center">

        <input
          type="text"
          placeholder="Search by name, roll or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 p-3 border rounded-lg focus:ring-2 focus:ring-blue-800"
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="p-3 border rounded-lg"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map((dept) => (
            <option key={dept}>{dept}</option>
          ))}
        </select>

      </div>

      {/* TABLE */}
      <table className="w-full border-collapse">

        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="p-3">Roll</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Department</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map((s) => (

            <tr
              key={s.id}
              className="border-t hover:bg-slate-50 transition"
            >

              <td className="p-3">{s.studentRoll}</td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.email}</td>
              <td className="p-3">{s.department}</td>

              <td className="px-6 py-4 text-right relative">

                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === s.id ? null : s.id)
                  }
                  className="p-2 rounded-lg hover:bg-slate-200"
                >
                  <MoreVertical size={18} />
                </button>

                {openMenuId === s.id && (

                  <div className="absolute right-6 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">

                    <button
                      onClick={() => navigate(`/admin/students/${s.id}`)}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-100"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/admin/students/edit/${s.id}`)}
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-100"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-100"
                    >
                      <KeyRound size={16} />
                      Reset Password
                    </button>

                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-100 text-orange-600"
                    >
                      <Archive size={16} />
                      Archive
                    </button>

                    <button
                      className="flex items-center gap-2 w-full px-4 py-2 hover:bg-slate-100 text-red-600"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>

                )}

              </td>

            </tr>

          ))}
        </tbody>

      </table>

    </div>
  );
};

export default AdminStudentList;