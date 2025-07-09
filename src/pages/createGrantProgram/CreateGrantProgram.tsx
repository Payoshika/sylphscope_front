import GrantNav from "./GrantNav";
import GrantName from "./GrantName";
import GrantDescription from "./GrantDescription";
import GrantEligibility from "./GrantEligibility";
// Import other step components...
import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import type { GrantProgram, Schedule } from "../../types/grantProgram";
import { GrantStatus } from "../../types/grantProgram";
import { createGrantProgram, updateGrantProgram } from "../../services/GrantProgramService";

const steps = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "eligibility", label: "Eligibility" },
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
  questionGroupsIds: [],
};

// ...existing imports...

const CreateGrantProgram = () => {
  const [grantProgram, setGrantProgram] = useState<GrantProgram>(initialGrantProgram);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateGrant = async (grantProgram: GrantProgram) => {
    return createGrantProgram(grantProgram);
  };

  const handleUpdateGrant = async (id: string, grantProgram: GrantProgram) => {
    return updateGrantProgram(id, grantProgram);
  };

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
                // id="eligibility"
                // name="eligibility"
                // grantProgram={grantProgram}
                // onGrantProgramChange={setGrantProgram}
                // onUpdateGrant={handleUpdateGrant}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default CreateGrantProgram;