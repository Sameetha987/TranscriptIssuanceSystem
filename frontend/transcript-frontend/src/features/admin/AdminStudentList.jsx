import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AdminStudentList = () => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/admin/students/all");
      setStudents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-8">

      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Students
      </h2>

      <table className="w-full border-collapse">

        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="p-3">Roll</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Department</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              onClick={() => navigate(`/admin/students/${s.id}`)}
              className="border-t hover:bg-slate-50 cursor-pointer transition"
            >
              <td className="p-3">{s.studentRoll}</td>
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.email}</td>
              <td className="p-3">{s.department}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default AdminStudentList;