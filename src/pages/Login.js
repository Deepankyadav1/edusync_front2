import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";
import "./Login.css"; // Custom styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
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
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="container-fluid login-bg d-flex align-items-center justify-content-center">
      <div className="login-box shadow-lg p-4 rounded bg-white">
        <h3 className="text-center mb-4 scholar-text">🔐 Login to EduSync</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="📧 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
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
          <button type="submit" className="btn btn-primary w-100 scholar-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
