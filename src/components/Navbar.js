import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("name");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left side - Brand and links */}
        <div className="d-flex align-items-center gap-3">
          <Link className="navbar-brand fw-bold" to="/">
            EduSync
          </Link>
          {token && (
            <ul className="navbar-nav flex-row gap-3">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/results">
                  Results
                </Link>
              </li>
              {role === "Student" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/my-courses">
                    My Courses
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Center username */}
        {token && (
          <div className="text-white fw-semibold">
            Welcome, <span className="text-warning">{username}</span>
          </div>
        )}

        {/* Right side - Buttons */}
        <div className="d-flex align-items-center gap-2">
          {!token ? (
            <>
              <Link to="/login" className="btn btn-outline-light">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-light">
                Register
              </Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
