import { useState } from "react";
import axios from "../../api/axios";

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

  const [studentDetails, setStudentDetails] = useState({
    studentId: "",
    studentEmail: "",
    studentName: "",
    program: "",
    department: "",
    semester: ""
  });

  const [subjects, setSubjects] = useState([
    { code: "", name: "", credits: "", marks: "", grade: "O" }
  ]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle student input
  const handleStudentChange = (e) => {
    setStudentDetails({
      ...studentDetails,
      [e.target.name]: e.target.value
    });
  };

  // Handle subject change
 const handleSubjectChange = (index, e) => {
   const updated = [...subjects];
   updated[index][e.target.name] = e.target.value;

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
        ...studentDetails,
        cgpa,
        subjects: subjects
      };

      const response = await axios.post("/api/transcripts/issue", payload);

      setResult(response.data.data);

    } catch (error) {
      alert("Failed to issue transcript");
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
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            Student Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(studentDetails).map((key) => (
              <input
                key={key}
                name={key}
                placeholder={key}
                className="p-3 border rounded-lg"
                onChange={handleStudentChange}
              />
            ))}
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
                  className="p-3 border rounded-lg"
                  onChange={(e) => handleSubjectChange(index, e)}
                />

                <input
                  name="name"
                  placeholder="Name"
                  className="p-3 border rounded-lg"
                  onChange={(e) => handleSubjectChange(index, e)}
                />

                <input
                  name="credits"
                  placeholder="Credits"
                  className="p-3 border rounded-lg"
                  onChange={(e) => handleSubjectChange(index, e)}
                />

                <input
                  name="marks"
                  placeholder="Marks"
                  className="p-3 border rounded-lg"
                  onChange={(e) => handleSubjectChange(index, e)}
                />

                <input
                  value={s.grade || ""}
                  readOnly
                  className="p-3 border rounded-lg bg-gray-100 font-semibold"
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
          className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg transition"
        >
          {loading ? "Processing..." : "Issue Transcript"}
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