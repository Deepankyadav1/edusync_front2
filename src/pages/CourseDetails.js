import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const CourseDetails = () => {
  const { id } = useParams(); // courseId from URL
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const fetchCourseData = async () => {
      try {
        const [courseRes, assessmentsRes] = await Promise.all([
          API.get(`/courses/${id}`),
          API.get(`/assessments/bycourse/${id}`),
        ]);
        setCourse(courseRes.data);
        setAssessments(assessmentsRes.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load course details.");
        setLoading(false);
        console.error("Failed to fetch course or assessments", error);
      }
    };

    fetchCourseData();
  }, [id, navigate]);

  const handleDeleteAssessment = async (assessmentId) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      try {
        await API.delete(`/assessments/${assessmentId}`);
        setAssessments((prev) =>
          prev.filter((a) => a.assessmentId !== assessmentId)
        );
        alert("Assessment deleted successfully.");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete assessment.");
      }
    }
  };

  const handleDeleteCourse = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This will remove all related assessments."
      )
    ) {
      try {
        await API.delete(`/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Course deleted successfully.");
        navigate("/dashboard");
      } catch (err) {
        console.error("Course delete error:", err);
        alert("Failed to delete course.");
      }
    }
  };
  

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-4 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">{course.title}</h3>

        {role === "Instructor" && (
          <button
            className="btn btn-outline-danger"
            onClick={handleDeleteCourse}
          >
            🗑️ Delete Course
          </button>
        )}
      </div>

      <p>{course.description}</p>
      <p>
        <strong>Instructor:</strong>{" "}
        {course.instructor?.name || course.instructor || "N/A"}
      </p>

      {role === "Instructor" && (
        <button
          className="btn btn-outline-success mb-3"
          onClick={() => navigate(`/courses/${course.courseId}/add-assessment`)}
        >
          ➕ Add Quiz
        </button>
      )}
      {course.mediaUrl && (
        <div className="mt-3">
          <strong>Course Material:</strong>{" "}
          <a href={course.mediaUrl} target="_blank" rel="noopener noreferrer">
            Download/View File
          </a>
        </div>
      )}
      <h5 className="mt-4">Assessments</h5>
      {assessments.length === 0 ? (
        <p>No assessments available.</p>
      ) : (
        <ul className="list-group">
          {assessments.map((a) => (
            <li
              key={a.assessmentId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{a.title}</span>

              <div className="btn-group">
                {role === "Student" && (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/quiz/${a.assessmentId}`)}
                  >
                    Take Quiz
                  </button>
                )}
                {role === "Instructor" && (
                  <>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        navigate(`/assessments/${a.assessmentId}/edit`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => handleDeleteAssessment(a.assessmentId)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseDetails;
