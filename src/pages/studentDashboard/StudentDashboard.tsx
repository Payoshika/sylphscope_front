import StudentDashboardNav from "./StudentDashboardNav";
import GrantList from "./GrantList";
import StudentProfile from "./StudentProfile";
import AppliedGrantList from "./AppliedGrantList";
import FurtherInfo from "./FurtherInfo";
import Message from "./Message";
import Settings from "../settings/Settings";
import { useOutletContext, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import type { Student } from "../../types/student";

const steps = [
    { key: "profile", label: "Basic Profile" },
    // { key: "further-info", label: "Further Information" },
    { key: "list", label: "Available Grants" },
    { key: "applied", label: "Applied Grants" },
    { key: "messages", label: "Messages" },
    { key: "settings", label: "Settings" },
];

const StudentDashboard = () => {
  const { student, updateStudent } = useOutletContext<{
  student: Student;
  setStudent: (s: Student) => void;
  updateStudent: (s: Student) => Promise<Student>;
    }>();
  const navigate = useNavigate();
  const location = useLocation();
  const handleStepChange = (stepKey: string) => {
    navigate(`/student-dashboard/${stepKey}`);
  };

  return (
    <div className="grant-create-layout">
      <StudentDashboardNav
        steps={steps}
        currentStep={location.pathname.split("/").pop() || steps[0].key}
        onStepChange={handleStepChange}
      />
      <main className="grant-create-content">
        <Routes>
          <Route path="/" element={<Navigate to="list" replace />} />
          <Route
            path="list"
            element={
              <GrantList
              />
            }
          />
        <Route
            path="profile"
            element={<StudentProfile student={student} updateStudent={updateStudent} />}
          />
        <Route
            path="further-info"
            element={<FurtherInfo />}
        />
        <Route
            path="applied"
            element={<AppliedGrantList />}
        />
        <Route
            path="messages"
            element={<Message/>}
        />
        <Route
            path="settings"
            element={<Settings />}
        />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;