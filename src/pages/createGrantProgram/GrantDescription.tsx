import React, { useState } from "react";
import Textarea from "../../components/inputComponents/Textarea";
import Button from "../../components/basicComponents/Button";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate } from "react-router-dom";
import TitleAndHeadLine from "./TitleAndHeadLine";

interface GrantDescriptionProps {
  id: string;
  name: string;
  grantProgram: GrantProgram;
  onGrantProgramChange: (updated: GrantProgram) => void;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
  error?: boolean | string;
  required?: boolean;
}

const GrantDescription: React.FC<GrantDescriptionProps> = ({
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
    onGrantProgramChange({ ...grantProgram, description: e.target.value });
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
        response = await onUpdateGrant(grantProgram.id, grantProgram);
        onGrantProgramChange({ ...grantProgram, ...response.data });
        setSubmitSuccess("Grant description updated successfully.");
        navigate("../eligibility");
      } else {
        setSubmitError("Grant must be created before adding a description.");
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError("Failed to update grant description. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
        <TitleAndHeadLine title="Create Description" headline="Provide a detailed description of the grant program" provider={true} />
        <form className="form-group" onSubmit={handleSubmit}>
        <Textarea
          id={id}
          name={name}
          label="Grant Description"
        placeholder="Enter the grant program description"
        value={grantProgram.description}
        onChange={handleInputChange}
        required={required}
        rows={6}
      />
      <Button
        text={isSubmitting ? "Saving..." : "Save Description"}
        disabled={isSubmitting || !grantProgram.description}
      />
      {submitError && <div className="error-message">{submitError}</div>}
      {submitSuccess && <div className="success-message">{submitSuccess}</div>}
    </form>

    </div>
    
  );
};

export default GrantDescription;