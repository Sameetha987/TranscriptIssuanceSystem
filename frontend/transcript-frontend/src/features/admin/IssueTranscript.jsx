import { useState, useEffect } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";

const gradePointsMap = {
  O: 10,
  "A+": 9.5,
  A: 9,
  "B+": 8.5,
  B: 8,
  C: 7,
  D: 6,
  F: 0,
};

const getGradeFromMarks = (marks) => {
  if (marks >= 95) return "O";
  if (marks >= 90) return "A+";
  if (marks >= 85) return "A";
  if (marks >= 80) return "B+";
  if (marks >= 70) return "B";
  if (marks >= 60) return "C";
  if (marks >= 50) return "D";
  return "F";
};

const IssueTranscript = () => {

  const [form, setForm] = useState({
    studentRoll: "",
    program: "",
    semester: ""
  });

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [subjects, setSubjects] = useState([
    { code: "", name: "", credits: "", marks: "", grade: "O" }
  ]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/admin/students/all");
      setStudents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch students");
    }
  };

  const filteredStudents = students.filter((s) =>
    s.studentRoll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchTerm(student.studentRoll);
    setShowSuggestions(false);

    setForm({
      ...form,
      studentRoll: student.studentRoll
    });
  };
  // Handle student input
  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle subject change
 const handleSubjectChange = (index, e) => {
   const updated = [...subjects];
   updated[index][e.target.name] = e.target.value;
   if (name === "code") {
     const duplicate = subjects.some(
       (s, i) => s.code === value && i !== index
     );

     if (duplicate) {
       toast.error("Subject code must be unique");
       return;
     }
   }
   if (e.target.name === "marks") {
     updated[index].grade = getGradeFromMarks(Number(e.target.value));
   }

   setSubjects(updated);
 };

  // Add subject row
  const addSubject = () => {
    setSubjects([...subjects, { code: "", name: "", credits: "", grade: "O" }]);
  };

  // Calculate CGPA
  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((s) => {
      const credits = Number(s.credits);
      const gradePoint = gradePointsMap[s.grade];

      if (credits && gradePoint !== undefined) {
        totalCredits += credits;
        totalPoints += credits * gradePoint;
      }
    });

    if (totalCredits === 0) return 0;

    return (totalPoints / totalCredits).toFixed(2);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const cgpa = calculateCGPA();

      const payload = {
        ...form,
        cgpa,
        subjects
      };

      const response = await axios.post("/api/transcripts/issue", payload);
      if (!form.studentRoll) {
        toast.error("Please select a student");
        return;
      }
      setResult(response.data.data);
      toast.success("Transcript issued successfully");

    } catch (error) {
      toast.error("Failed to issue transcript");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Issue Transcript
        </h1>
        <p className="text-slate-500 mt-1">
          Add student details and subjects to generate transcript
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-8">

        {/* Student Details */}
        <div>
          <h2 className="text-lg font-semibold mb-6 text-slate-700">
            Student Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Roll Number Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Roll Number
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Type Roll Number..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800"
              />

              {showSuggestions && searchTerm && (
                <div className="absolute z-10 bg-white border rounded-lg shadow-lg w-full mt-1 max-h-48 overflow-y-auto">
                  {filteredStudents.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectStudent(s)}
                      className="p-3 hover:bg-slate-100 cursor-pointer"
                    >
                      {s.studentRoll}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Student Name */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Name
              </label>

              <input
                value={selectedStudent?.name || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-slate-100"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Department
              </label>

              <input
                value={selectedStudent?.department || ""}
                readOnly
                className="w-full p-3 border rounded-lg bg-slate-100"
              />
            </div>

            {/* Program */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Program
              </label>

              <select
                name="program"
                value={form.program}
                onChange={handleFormChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800"
                required
              >
                <option value="">Select Program</option>
                <option value="B.E">B.E</option>
                <option value="B.Tech">B.Tech</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Semester
              </label>

              <select
                name="semester"
                value={form.semester}
                onChange={handleFormChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800"
                required
              >
                <option value="">Select Semester</option>
                {[1,2,3,4,5,6,7,8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Subjects Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            Subjects
          </h2>

          <div className="space-y-4">
            {subjects.map((s, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4">

                <input
                  name="code"
                  placeholder="Code"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => handleSubjectChange(index, e)}
                />

                <input
                  name="name"
                  placeholder="Name"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => handleSubjectChange(index, e)}
                />

                <input
                  name="credits"
                  placeholder="Credits"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => handleSubjectChange(index, e)}
                />

                <input
                  name="marks"
                  placeholder="Marks"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => handleSubjectChange(index, e)}
                />

                <input
                  value={s.grade || ""}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-100 font-semibold"
                />

              </div>
            ))}
          </div>

          <button
            onClick={addSubject}
            className="mt-4 text-blue-700 font-medium"
          >
            + Add Subject
          </button>
        </div>

        {/* CGPA Display */}
        <div className="bg-slate-50 p-4 rounded-lg border">
          <p className="text-slate-600">
            Calculated CGPA:
            <span className="ml-2 font-bold text-blue-800">
              {calculateCGPA()}
            </span>
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          {loading ? "Issuing..." : "Issue Transcript"}
        </button>

      </div>

      {result && (
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-emerald-700 mb-4">
            Transcript Issued Successfully
          </h2>

          <p><strong>Transcript ID:</strong> {result.id}</p>
          <p><strong>Blockchain Record ID:</strong> {result.blockchainRecordId}</p>
          <p><strong>Transaction Hash:</strong> {result.blockchainTxId}</p>
        </div>
      )}

    </div>
  );
};

export default IssueTranscript;