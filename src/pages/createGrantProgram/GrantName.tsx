import React, { useState } from "react";
import TextInput from "../../components/inputComponents/TextInput";
import Button from "../../components/basicComponents/Button";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate } from "react-router-dom";
import TitleAndHeadLine from "./TitleAndHeadLine";


interface GrantNameProps {
  id: string;
  name: string;
  grantProgram: GrantProgram;
  onGrantProgramChange: (updated: GrantProgram) => void;
  onCreateGrant: (grantProgram: GrantProgram) => Promise<any>;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
  error?: boolean | string;
  required?: boolean;
}

const GrantName: React.FC<GrantNameProps> = ({
  id,
  name,
  grantProgram,
  onGrantProgramChange,
  onCreateGrant,
  onUpdateGrant,
  error = false,
  required = true,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handler for TextInput's onChange event
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onGrantProgramChange({ ...grantProgram, title: e.target.value });
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      let response;
      if (grantProgram.id && grantProgram.id !== "") {
        response = await onUpdateGrant(grantProgram.id, grantProgram);
        setSubmitSuccess("Grant name updated successfully.");
      } else {
        response = await onCreateGrant(grantProgram);
        setSubmitSuccess("Grant name is created successfully.");
        onGrantProgramChange({ ...grantProgram, ...response.data });
      }
      navigate("../description");
    } catch (err: any) {
        console.error(err);
        setSubmitError("Failed to save grant name. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <TitleAndHeadLine title="Grant Name" headline="Create a new grant program" provider={true} />
      <form className="form-group" onSubmit={handleSubmit}>
        <TextInput
          id={id}
          name={name}
          label="Grant Name"
          placeholder="Enter the grant program name"
          value={grantProgram.title ?? ""}
          onChange={handleInputChange}
          required={required}
          error={error}
          autoComplete="off"
        />
        <Button
          text={isSubmitting ? "Saving..." : "Save Grant Name"}
          disabled={isSubmitting || !grantProgram.title}
        />
        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">{submitSuccess}</div>}
      </form>
    </div>
  );
};

export default GrantName;