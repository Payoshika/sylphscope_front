import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";
import FigorousLogo from "../components/icons/FigorousLogo";
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail01Icon } from '@hugeicons/core-free-icons';
import {DashboardSquare01Icon} from '@hugeicons/core-free-icons';
import {Profile02Icon, UserSquareIcon, Logout02Icon, MessageQuestionIcon} from '@hugeicons/core-free-icons';
const Navigation: React.FC = () => {
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
            <span className="nav-logo-text"><h2 className="no-margin">Figorous</h2></span>
            <span className="nav-logo-svg"><FigorousLogo role={role} /></span>
            {user && role && (
              <p className={`user-type ${role}-color`}>for {role}</p>
            )}
          </div>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                {user && user.roles?.[0] === "ROLE_STUDENT" && (
                  <Link to="/student-dashboard" className="btn btn--small nav-link">
                    <span className="nav-link-icon"><HugeiconsIcon icon={DashboardSquare01Icon} /></span>
                    <span className="nav-link-label">Dashboard</span>
                  </Link>
                )}
                {user && user.roles?.[0] === "ROLE_PROVIDER" && (
                  <>
                      <Link to="/grant-management" className="btn btn--small nav-link">
                        <span className="nav-link-icon"><HugeiconsIcon icon={DashboardSquare01Icon} /></span>
                        <span className="nav-link-label">Dashboard</span>
                      </Link>
                      <Link to="/organisation" className="btn btn--small nav-link">
                        <span className="nav-link-icon"><HugeiconsIcon icon={Profile02Icon} /></span>
                        <span className="nav-link-label">Organisation</span>
                      </Link>
                    <Link to="/grant-management/staff-profile" className="btn btn--small nav-link">
                        <span className="nav-link-icon"><HugeiconsIcon icon={UserSquareIcon} /></span>
                        <span className="nav-link-label">Profile</span>
                      </Link>
                  </>
                )}
                {user && user.roles?.[0] === "ROLE_STUDENT" && (
                  <Link to="/student-dashboard/messages" className="btn btn--small nav-link">
                    <span className="nav-link-icon"><HugeiconsIcon icon={Mail01Icon} /></span>
                    <span className="nav-link-label">Message</span>
                  </Link>
                )}
                {user && user.roles?.[0] === "ROLE_PROVIDER" && (
                  <Link to="/grant-management/messages" className="btn btn--small nav-link">
                    <span className="nav-link-icon"><HugeiconsIcon icon={Mail01Icon} /></span>
                    <span className="nav-link-label">Message</span>
                  </Link>
                )}
                <Link to="/contact" className="btn btn--small btn--ghost nav-link">
                  <span className="nav-link-icon"><HugeiconsIcon icon={MessageQuestionIcon} /></span>
                  <span className="nav-link-label">Contact</span>
                </Link>
                <button
                      onClick={handleLogout}
                      className="btn btn--small btn--outline nav-link"
                    >
                      <span className="nav-link-icon"><HugeiconsIcon icon={Logout02Icon} /></span>
                      <span className="nav-link-label">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/contact" className="btn btn--small btn--ghost nav-link">
                  <span className="nav-link-icon"><HugeiconsIcon icon={MessageQuestionIcon} /></span>
                  <span className="nav-link-label">Contact</span>
                </Link>
                <Link to="/signin" className="btn btn--small btn--ghost">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn--small">
                  Sign Up
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
