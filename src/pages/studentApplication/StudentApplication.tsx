import { useEffect, useState } from "react";
import StudentApplicationNav from "./StudentApplicationNav";
import GrantOverview from "./GrantOverview";
import OrganisationInfo from "./OrganisationInfo";
import Eligibility from "./Eligibility";
import { useOutletContext, Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import type { Student } from "../../types/student";
import { getGrantProgramAndApplicationByStudentIdandGrantProgramId, getEligibilityCriteriaAndQuestionFromGrantProgramId } from "../../services/ApplicationService";
import type { ApplicationDto, GrantProgramApplicationDto, EligibilityCriteriaWithQuestionDto } from "../../types/application";
import type { GrantProgramDto } from "../../types/grantProgram";

const steps = [
    {key: "organisation", label: "Organisation Info"},
  { key: "overview", label: "Grant Overview" },
  { key: "eligibility", label: "Eligibility Criteria" },
  { key: "questions", label: "Questions" },
  { key: "message", label: "Message"},
];

const StudentApplication = () => {
  const { student } = useOutletContext<{ student: Student }>();
  const { grantProgramId } = useParams<{ grantProgramId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [grantProgram, setGrantProgram] = useState<GrantProgramDto | null>(null);
  const [application, setApplication] = useState<ApplicationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityCriteriaWithQuestion, setEligibilityCriteriaWithQuestion] = useState<EligibilityCriteriaWithQuestionDto[]>([]);

  const handleStepChange = (stepKey: string) => {
    navigate(`/student-application/${grantProgramId}/${stepKey}`);
  };

  useEffect(() => {
    const fetchGrantProgramApplication = async () => {
      if (!student?.id || !grantProgramId) return;
      try {
        const data: GrantProgramApplicationDto = await getGrantProgramAndApplicationByStudentIdandGrantProgramId(
          student.id,
          grantProgramId
        );
        setGrantProgram(data.grantProgram);
        setApplication(data.application);
        // Fetch eligibility criteria and questions
        const criteriaWithQuestionList = await getEligibilityCriteriaAndQuestionFromGrantProgramId(grantProgramId);
        setEligibilityCriteriaWithQuestion(criteriaWithQuestionList);
        console.log("student application rendered");
      } catch (err) {
        setGrantProgram(null);
        setApplication(null);
        setEligibilityCriteriaWithQuestion([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGrantProgramApplication();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grant-create-layout">
      <StudentApplicationNav
        steps={steps}
        currentStep={location.pathname.split("/").pop() || steps[0].key}
        onStepChange={handleStepChange}
      />
      <main className="grant-create-content">
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
            <Route
                path="overview"
                element={<GrantOverview grantProgram={grantProgram} loading={loading} />}
            />
            <Route
            path="organisation"
                element={<OrganisationInfo grantProgram={grantProgram} loading={loading} />}
            />     
          <Route
            path="eligibility"
            element={<Eligibility eligibilityCriteriaWithQuestion={eligibilityCriteriaWithQuestion} application={application} studentId={student?.id ?? ""} grantProgramId={grantProgramId ?? ""} />}
        />   
    </Routes>
      </main>
    </div>
  );
};

export default StudentApplication;