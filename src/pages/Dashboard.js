import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    const userIdFromStorage = localStorage.getItem("userId");
    setRole(roleFromStorage);
    setUserId(userIdFromStorage);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view courses.");
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        setCourses(res.data);
      } catch (err) {
        setError("Failed to load courses.");
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    try {
      const payload = {
        userId: userId,
        courseId: courseId,
        id: 0,
      };

      await API.post("/enrollments", payload);
      alert("Enrolled successfully!");
    } catch (error) {
      console.error("Enrollment failed", error);
      alert("Failed to enroll in course. You may already be enrolled.");
    }
  };

  const handleSeeCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  if (loading)
    return (
      <div className="container mt-4">
        <p>Loading courses...</p>
      </div>
    );
  if (error)
    return (
      <div className="container mt-4 text-danger">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="page-wrapper">
      <div className="container mt-5">
        <h2 className="dashboard-title">{role} Dashboard</h2>

        {role === "Instructor" && (
          <button
            className="mentor-btn mt-3 mb-4"
            onClick={() => navigate("/add-course")}
          >
            ➕ Add New Course
          </button>
        )}

        <div className="row">
          {courses.length === 0 ? (
            <p>No courses available.</p>
          ) : (
            courses.map((course) => (
              <div key={course.courseId} className="col-md-4 mb-4">
                <div className="mentor-card">
                  <div className="mentor-card-body">
                    <h5 className="mentor-card-title">{course.title}</h5>
                    <p className="mentor-card-text">{course.description}</p>
                    <p className="mentor-card-instructor">
                      👨‍🏫 {course.instructor?.name || "Unknown"}
                    </p>
                  </div>

                  <div className="mentor-card-footer">
                    {role === "Student" && (
                      <button
                        className="mentor-btn-outline"
                        onClick={() => handleEnroll(course.courseId)}
                      >
                        ✅ Enroll
                      </button>
                    )}

                    {role === "Instructor" && (
                      <button
                        className="mentor-btn-outline"
                        onClick={() => handleSeeCourse(course.courseId)}
                      >
                        🔍 See Course
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
