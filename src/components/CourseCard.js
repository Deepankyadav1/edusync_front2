import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    if (!course.courseId) {
      alert("Invalid course ID. Cannot navigate.");
      return;
    }
    navigate(`/courses/${course.courseId}`);
  };

  const handleAddAssessment = () => {
    if (!course.courseId) {
      alert("Invalid course ID.");
      return;
    }
    navigate(`/courses/${course.courseId}/add-assessment`);
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{course.title}</h5>
        <p className="card-text">{course.description}</p>

        {course.mediaUrl && (
          <img
            src={course.mediaUrl}
            alt="Course"
            className="img-fluid mb-2"
            style={{ maxHeight: "200px", width: "100%", objectFit: "cover" }}
          />
        )}

        <p className="card-text text-muted">
          Instructor: {course.instructor?.name || course.instructor || "N/A"}
        </p>

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-outline-primary"
            onClick={handleViewCourse}
          >
            📘 View Course
          </button>

          <button
            className="btn btn-outline-success"
            onClick={handleAddAssessment}
          >
            ➕ Add Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
