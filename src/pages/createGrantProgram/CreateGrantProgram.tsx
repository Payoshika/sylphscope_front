import GrantNav from "./GrantNav";
import GrantName from "./GrantName";
import { useState } from "react";
import type { GrantProgram, Schedule } from "../../types/grantProgram";
import { GrantStatus } from "../../types/grantProgram";


const steps = [
  { key: "grant-name", label: "Grant Name" },
  { key: "details", label: "Details" },
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
    schedule: {} as Schedule,
    questionIds: [],
    questionGroupsIds: [],
}; 

const CreateGrantProgram = () => {
    const [grantProgram, setGrantProgram] = useState<GrantProgram>(initialGrantProgram);
    const [currentStep, setCurrentStep] = useState(steps[0].key);
    const [grantName, setGrantName] = useState("");
    const goToStep = (stepKey: string) => setCurrentStep(stepKey);
    let StepComponent = null;
    switch (currentStep) {
        case "grant-name":
        StepComponent = (
            <GrantName
            id="grant-name"
            name="grantName"
            grantProgram={grantProgram}
            onGrantProgramChange={setGrantProgram}
            />
        );
        break;
        // Add other cases for other steps...
        default:
        StepComponent = <div>Unknown step</div>;
    }

    return (
        <div className="grant-create-layout">
            <GrantNav
                steps={steps}
                currentStep={currentStep}
                onStepChange={goToStep}
            />
            <main className="grant-create-content">{StepComponent}</main>
        </div>
    );
};

export default CreateGrantProgram;