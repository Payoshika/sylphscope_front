import React, { useState } from "react";
import Textarea from "../../components/inputComponents/Textarea";
import Button from "../../components/basicComponents/Button";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate } from "react-router-dom";
import TitleAndHeadLine from "./TitleAndHeadLine";

interface GrantEligibilityProps {
  id: string;
  name: string;
  grantProgram: GrantProgram;
  onGrantProgramChange: (updated: GrantProgram) => void;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
  error?: boolean | string;
  required?: boolean;
}

const GrantEligibility: React.FC<GrantEligibilityProps> = ({
  id,
  name,
  grantProgram,
  onGrantProgramChange,
  onUpdateGrant,
  error = false,
  required = true,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onGrantProgramChange({ ...grantProgram, eligibility: e.target.value });
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      if (grantProgram.id && grantProgram.id !== "") {
        await onUpdateGrant(grantProgram.id, grantProgram);
        setSubmitSuccess("Eligibility criteria updated successfully.");
        navigate("../selection");
      } else {
        setSubmitError("Grant must be created before adding eligibility criteria.");
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError("Failed to update eligibility criteria. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <TitleAndHeadLine title="Create Eligibility Criteria" headline="Create Eligibility Criteria for the grant" provider={true} />
      <form className="form-group" onSubmit={handleSubmit}>
        <Button
          text={isSubmitting ? "Saving..." : "Save Eligibility"}
          disabled={isSubmitting}
        />
        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">{submitSuccess}</div>}
      </form>
    </div>
  );
};

export default GrantEligibility;