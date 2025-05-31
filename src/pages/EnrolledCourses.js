import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css"; // ✅ Use the same CSS as Dashboard

const EnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    setUserId(userIdFromStorage);

    const fetchEnrolledCourses = async () => {
      try {
        const res = await API.get(`/enrollments/user/${userIdFromStorage}`);
        setEnrolledCourses(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
        setLoading(false);
      }
    };

    if (userIdFromStorage) {
      fetchEnrolledCourses();
    }
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container mt-5">
        <h2 className="dashboard-title">🎓 My Enrolled Courses</h2>

        {loading ? (
          <p className="text-center">Loading enrolled courses...</p>
        ) : enrolledCourses.length === 0 ? (
          <p className="text-center">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div className="row">
            {enrolledCourses.map((course) => (
              <div key={course.courseId} className="col-md-4 mb-4">
                <div className="mentor-card h-100 d-flex flex-column justify-content-between">
                  <div className="mentor-card-body">
                    <h5 className="mentor-card-title">{course.title}</h5>
                    <p className="mentor-card-text">{course.description}</p>
                    <p className="mentor-card-instructor">
                      👨‍🏫 {course.instructor?.name || "Unknown"}
                    </p>
                  </div>
                  <div className="mentor-card-footer">
                    <button
                      className="mentor-btn-outline"
                      onClick={() => navigate(`/courses/${course.courseId}`)}
                    >
                      📘 Go to Course
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;
