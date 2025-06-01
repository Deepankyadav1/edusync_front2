import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Result.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://edusyncbackend5011-b9gshjc8auajdxat.centralindia-01.azurewebsites.net";

const Results = () => {
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    setRole(userRole);

    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Courses`);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/Users?role=Student`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to load students", err);
        setError("Failed to load students.");
      }
    };

    const fetchResults = async () => {
      try {
        let res;
        if (userRole === "Instructor") {
          res = await axios.get(`${API_BASE_URL}/api/Results/detailed`);
        } else {
          res = await axios.get(`${API_BASE_URL}/api/Results/user/${userId}`);
        }
        setResults(res.data);
        console.log("Fetched Results:", res.data);
      } catch (err) {
        console.error("Failed to load results", err);
        setError("Failed to load results.");
      }
    };

    fetchCourses();
    fetchResults();
    if (userRole === "Instructor") {
      fetchStudents();
    }
  }, []);

  const filteredResults = results.filter((r) => {
    const courseMatch = !selectedCourse || r.courseId?.toString() === selectedCourse;
    const studentMatch = !selectedStudent || r.userId === selectedStudent;
    return courseMatch && studentMatch;
  });

  return (
    <div className="container mt-4">
      <h3>
        📊{" "}
        {role === "Instructor"
          ? "All Students' Quiz Results"
          : "My Quiz Results"}
      </h3>

      {error && <p className="text-danger">{error}</p>}

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Filter by Course:</label>
          <select
            className="form-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {role === "Instructor" && (
          <div className="col-md-6">
            <label>Filter by Student:</label>
            <select
              className="form-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">All Students</option>
              {students.map((student) => (
                <option key={student.userId} value={student.userId}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>#</th>
              {role === "Instructor" && <th>Student</th>}
              <th>Course</th>
              <th>Assessment</th>
              <th>Score</th>
              <th>Attempt Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((res, index) => (
              <tr key={res.resultId || index}>
                <td>{index + 1}</td>
                {role === "Instructor" && <td>{res.userName}</td>}
                <td>{res.courseTitle}</td>
                <td>{res.assessmentTitle}</td>
                <td>{res.score}</td>
                <td>{new Date(res.attemptDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Results;

