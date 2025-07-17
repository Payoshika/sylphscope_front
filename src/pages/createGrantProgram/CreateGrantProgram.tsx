import GrantNav from "./GrantNav";
import GrantName from "./GrantName";
import GrantDescription from "./GrantDescription";
import GrantEligibility from "./GrantEligibility";
import ChooseOrCreateQuestions from "./ChooseOrCreateQuestions";
import SelectionCriteria from "./SelectionCriteria";

// Import other step components...
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import type { GrantProgram, Schedule } from "../../types/grantProgram";
import { GrantStatus } from "../../types/grantProgram";
import { createGrantProgram, updateGrantProgram,getGrantProgramById } from "../../services/GrantProgramService";
import type { ComparisonOperator, EligibilityGroupFormState,QuestionGroupEligibilityInfoDto, QuestionEligibilityInfoDto, EligibilityCriteriaDTO, QuestionCondition, SelectionCriterion, Option, InputType, DataType, Question } from "../../data/questionEligibilityInfoDto";
import ChooseOrCreateQuestion from "./ChooseOrCreateQuestions";

const steps = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "eligibility", label: "Eligibility" },
  { key: "questions", label: "Questions" },
  { key: "selection", label: "Selection" },
  { key: "schedule", label: "Schedule" },
  { key: "review", label: "Review & Submit" },
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
  createdAt: "",
  updatedAt: "",
  questionIds: [],
  selectionCriteria: [],
  questionGroupsIds: [],
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
          <Route
            path="title"
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
              <ChooseOrCreateQuestion
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
        </Routes>
      </main>
    </div>
  );
};

export default CreateGrantProgram;