import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddCourse from "./pages/AddCourse";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import CourseDetails from "./pages/CourseDetails";
import AddAssessment from "./pages/AddAssessment";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewResults from "./pages/ViewResults";
import EnrolledCourses from "./pages/EnrolledCourses";
import EditAssessment from "./pages/EditAssessment";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-courses" element={<EnrolledCourses />} />
          <Route
            path="/assessments/:assessmentId/edit"
            element={<EditAssessment />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-course"
            element={
              <ProtectedRoute>
                <AddCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/add-assessment"
            element={
              <ProtectedRoute>
                <AddAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-results"
            element={
              <ProtectedRoute>
                <ViewResults />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
