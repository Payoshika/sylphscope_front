import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const role = user?.roles?.[0]
    ? user.roles[0].replace(/^ROLE_/, "").toLowerCase()
    : "";

  return (
    <nav className="card">
      <div className="card__body">
        <div className="nav-container">
          <div className="nav-brand">
            <h2 className="no-margin">Figorous</h2>
            {user && role && (
              <p className={`user-type ${role}-color`}>for {role}</p>
            )}
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link
                  to="/components"
                  className={
                    location.pathname === "/components"
                      ? "btn btn--small"
                      : "btn btn--small btn--ghost"
                  }
                >
                  Components
                </Link>
                <div className="nav-user">
                  <span className="caption">
                    Welcome, {user?.username || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn--small btn--outline"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn--small btn--ghost">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn--small">
                  Sign Up
                </Link>
                <Link to="/create-dev/grant/title" className="btn btn--small btn--ghost">
                  Create Dev Grant
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
