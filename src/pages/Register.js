import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";
import "./Register.css"; // Bootstrap + Scholar styles

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      localStorage.setItem(
        "name",
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      );
      localStorage.setItem(
        "role",
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );
      localStorage.setItem(
        "userId",
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ]
      );

      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data || err.message));
      console.error(err);
    }
  };

  return (
    <div className="container-fluid register-bg d-flex align-items-center justify-content-center">
      <div className="register-box shadow-lg p-4 bg-white rounded">
        <h3 className="text-center mb-4 scholar-text">📝 Create an Account</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="👤 Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              className="form-control"
              type="email"
              placeholder="📧 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <input
              className="form-control"
              type={showPassword ? "text" : "password"}
              placeholder="🔒 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <div className="mb-4">
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>
          <button className="btn scholar-btn w-100" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
