import { useState } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";

const AdminCreateStudent = () => {

  const [form, setForm] = useState({
    studentRoll: "",
    name: "",
    email: "",
    department: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/api/admin/students/create",
        form
      );

      if (res.data.success) {
        toast.success("Student created successfully");
        setForm({
          studentRoll: "",
          name: "",
          email: "",
          department: "",
          password: ""
        });
      } else {
        toast.error(res.data.message);
      }

    } catch (err) {
      toast.error("Failed to create student");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10">

        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Create Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="studentRoll"
            value={form.studentRoll}
            onChange={handleChange}
            placeholder="Student Roll"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Student Name"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition"
          >
            Create Student
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminCreateStudent;