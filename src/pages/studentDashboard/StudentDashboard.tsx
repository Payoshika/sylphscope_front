import { useEffect, useState } from "react";
import StudentDashboardNav from "./StudentDashboardNav";
import GrantList from "./GrantList";
import StudentProfile from "./StudentProfile";

import { useOutletContext, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import type { Student } from "../../types/student";
import type { GrantProgram } from "../../types/grantProgram";
// import { getGrantPrograms } from "../../services/GrantProgramService";
import { updateStudentByStudentId } from "../../services/StudentService";

const steps = [
  { key: "list", label: "Available Grants" },
  { key: "profile", label: "Profile" },
];

const StudentDashboard = () => {
    const { student, setStudent, updateStudent } = useOutletContext<{
  student: Student;
  setStudent: (s: Student) => void;
  updateStudent: (s: Student) => Promise<Student>;
    }>();
  const [grantPrograms, setGrantPrograms] = useState<GrantProgram[]>([]);
  const [loadingGrants, setLoadingGrants] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  console.log(student);
  const handleStepChange = (stepKey: string) => {
    navigate(`/student-dashboard/${stepKey}`);
  };

//   useEffect(() => {
//     const fetchGrants = async () => {
//       if (student?.id) {
//         setLoadingGrants(true);
//         try {
//           const grants = await getGrantPrograms();
//           setGrantPrograms(grants);
//         } catch (err) {
//           setGrantPrograms([]);
//         }
//         setLoadingGrants(false);
//       }
//     };
//     fetchGrants();
//   }, [student?.id]);

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
                grantPrograms={grantPrograms}
                loading={loadingGrants}
              />
            }
          />
        <Route
            path="profile"
            element={<StudentProfile />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;