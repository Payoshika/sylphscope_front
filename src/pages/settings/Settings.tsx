import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";

type TabType = "profile" | "security";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  if (!user) {
    return (
      <div className="settings-container">
        <div className="card">
          <div className="card__body">
            <p className="text-center">No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      {/* Settings Header */}
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      {/* Tab Navigation */}
      <div className="settings-tabs">
        <button
          className={`settings-tab ${
            activeTab === "profile" ? "settings-tab--active" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <span className="settings-tab-icon">Profile</span>
        </button>
        <button
          className={`settings-tab ${
            activeTab === "security" ? "settings-tab--active" : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          <span className="settings-tab-icon">Security</span>
        </button>
      </div>
      {/* Tab Content */}
      <div className="settings-content">
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "security" && <SecuritySettings />}
      </div>
    </div>
  );
};

export default Settings;
