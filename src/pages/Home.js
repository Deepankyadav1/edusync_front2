import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const API_BASE_URL = "https://edusyncbackend5011-b9gshjc8auajdxat.centralindia-01.azurewebsites.net";


const Home = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, coursesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/Users`),
          axios.get(`${API_BASE_URL}/api/Courses`),
        ]);

        const students = usersRes.data.filter(
          (user) => user.role === "Student"
        );

        setStudentsCount(students.length);
        setCoursesCount(coursesRes.data.length);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Failed to load stats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Live clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Format time
  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="home-hero d-flex align-items-center justify-content-center text-center">
        <div className="text-white px-3">
          <h1 className="display-3 fw-bold mb-3">🚀 Welcome to EduSync</h1>
          <p className="lead fw-normal mb-4">
            A modern platform to <strong>learn, assess</strong>, and{" "}
            <strong>grow</strong> — all in one place.
          </p>
          <Link to="/login" className="btn mentor-btn px-4 py-2">
            Get Started
          </Link>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="container py-5 text-center">
        <h2 className="mb-4 fw-bold">📈 Live Platform Stats</h2>

        {loading ? (
          <p>Loading stats...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className="row justify-content-center">
            <div className="col-md-4 mb-4">
              <div className="stats-box p-4 shadow rounded-3 bg-light">
                <h3>👨‍🎓 {studentsCount}+</h3>
                <p>Active Students</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="stats-box p-4 shadow rounded-3 bg-light">
                <h3>📘 {coursesCount}</h3>
                <p>Courses Available</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="stats-box p-4 shadow rounded-3 bg-light">
                <h3>🕒 {formatTime(currentTime)}</h3>
                <p>Current Time</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
