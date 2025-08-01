import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import SecuritySettings from "./SecuritySettings";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

const Settings: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="content">
        <div className="card">
          <div className="card__body">
            <p className="text-center">No user data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Settings"
        headline="Manage your account security"
        student={true}
      />
      <div className="settings-content">
        <SecuritySettings />
      </div>
    </div>
  );
};

export default Settings;
