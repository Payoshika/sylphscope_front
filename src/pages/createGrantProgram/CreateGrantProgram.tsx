import GrantNav from "./GrantNav";
import GrantName from "./GrantName";
import GrantDescription from "./GrantDescription";
import GrantEligibility from "./GrantEligibility";
import ChooseOrCreateQuestions from "./ChooseOrCreateQuestions";
import SelectionCriteria from "./SelectionCriteria";
import GrantSchedule from "./GrantSchedule";
import GrantAmount from "./GrantAmount";
import AssignedStaff from "./AssignedStaff";

// Import other step components...
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import type { GrantProgram, Schedule } from "../../types/grantProgram";
import { GrantStatus } from "../../types/grantProgram";
import { createGrantProgram, updateGrantProgram,getGrantProgramById } from "../../services/GrantProgramService";
import type { QuestionGroupEligibilityInfoDto, QuestionEligibilityInfoDto, EligibilityCriteriaDTO } from "../../data/questionEligibilityInfoDto";

const steps = [
  { key: "name", label: "Grant Name" },
  { key: "description", label: "Description" },
  { key: "amount", label: "Grant Amount" },
  { key: "schedule", label: "Schedule" },
  { key: "eligibility", label: "Eligibility" },
  { key: "selection-criteria", label: "Selection Criteria" },
  { key: "questions", label: "Questions" },
  { key: "assigned-staff", label: "Assigned Staff" },
];

const initialGrantProgram: GrantProgram = {
  id: "",
  title: "",
  description: "",
  providerId: "",
  status: GrantStatus.DRAFT,
  schedule: {
    applicationStartDate: null,
    applicationEndDate: null,
    decisionDate: null,
    fundDisbursementDate: null,
  } as Schedule,
  assignedStaffIds: [],
  contactPerson: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "MANAGER",
    providerId: "",
  },
  createdAt: "",
  updatedAt: "",
  questionIds: [],
  selectionCriteria: [],
  questionGroupsIds: [],
  evaluationScale: "HUNDRED"
};

// ...existing imports...

const CreateGrantProgram = () => {
  const [grantProgram, setGrantProgram] = useState<GrantProgram>(initialGrantProgram);
  const [eligibilityQuestions, setEligibilityQuestions] = useState<QuestionEligibilityInfoDto[]>([]);
  const [eligibilityQuestionGroups, setEligibilityQuestionGroups] = useState<QuestionGroupEligibilityInfoDto[]>([]);
  const [eligibilities, setEligibilities] = useState<EligibilityCriteriaDTO[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionEligibilityInfoDto[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { grantProgramId } = useParams();

  const handleCreateGrant = async (grantProgram: GrantProgram) => {
    return createGrantProgram(grantProgram);
  };

  const handleUpdateGrant = async (id: string, grantProgram: GrantProgram) => {
    return updateGrantProgram(id, grantProgram);
  };

  const getGrantProgram = async () => {
    const id = grantProgram.id || grantProgramId;
    if (id) {
      try {
        const data = await getGrantProgramById(id);
        console.log("grant program is ", data);
        setGrantProgram(data);
      } catch (err) {
        console.error("Failed to fetch grant program:", err);
      }
    }
  };

  useEffect(() => {
    getGrantProgram();
  }, [grantProgramId]);

  const handleStepChange = (stepKey: string) => {
    const segments = location.pathname.split("/");
    segments[segments.length - 1] = stepKey;
    const newPath = segments.join("/");
    navigate(newPath);
};

  return (
    <div className="grant-create-layout">
      <GrantNav
        steps={steps}
        currentStep={location.pathname.split("/").pop() || steps[0].key}
        onStepChange={handleStepChange}
      />
      <main className="grant-create-content">
        <Routes>
          <Route path="/" element={<Navigate to="name" replace />} />
          <Route
            path="name"
            element={
              <GrantName
          id="title"
          name="title"
          grantProgram={grantProgram}
          onGrantProgramChange={setGrantProgram}
          onCreateGrant={handleCreateGrant}
          onUpdateGrant={handleUpdateGrant}
              />
            }
          />
          <Route
            path="description"
            element={
              <GrantDescription
          id="description"
          name="description"
          grantProgram={grantProgram}
          onGrantProgramChange={setGrantProgram}
          onUpdateGrant={handleUpdateGrant}
              />
            }
          />
          <Route
            path="amount"
            element={
              <GrantAmount
          grantProgram={grantProgram}
          onGrantProgramChange={setGrantProgram}
          onUpdateGrant={handleUpdateGrant}
              />
            }
          />
          <Route
            path="eligibility"
            element={
              <GrantEligibility
          id="eligibility"
          name="eligibility"
          grantProgram={grantProgram}
          onUpdateGrant={handleUpdateGrant}
          onGrantProgramChange={setGrantProgram}
          eligibilityQuestions={eligibilityQuestions}
          setEligibilityQuestions={setEligibilityQuestions}
          eligibilityQuestionGroups={eligibilityQuestionGroups}
          setEligibilityQuestionGroups={setEligibilityQuestionGroups}
          eligibilities={eligibilities}
          setEligibilities={setEligibilities}
          error={false}
          required={true}
              />
            }
          />
          <Route
            path="questions"
            element={
              <ChooseOrCreateQuestions
          grantProgram={grantProgram}
          onUpdateGrant={getGrantProgram}
          questions={eligibilityQuestions}
          questionGroups={eligibilityQuestionGroups}
          eligibilities={eligibilities}
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
            />
            }
          />
          <Route
          path="selection"
          element={
            <SelectionCriteria
              grantProgram={grantProgram}
              onUpdateGrant={handleUpdateGrant}
              selectedQuestions={selectedQuestions}
              setGrantProgram={setGrantProgram}
            />
          }
        />
        <Route
          path="schedule"
          element={
            <GrantSchedule
              grantProgram={grantProgram}
              setGrantProgram={setGrantProgram}
              onUpdateGrant={handleUpdateGrant}
              getGrantProgram={getGrantProgram}
            />
          }
        />
        <Route
          path="assigned-staff"
          element={<AssignedStaff grantProgramId={grantProgram?.id || ""} grantProgram={grantProgram} onGrantProgramChange={setGrantProgram} />}
        />
        </Routes>
      </main>
    </div>
  );
};

export default CreateGrantProgram;