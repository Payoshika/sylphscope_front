import React, { useState } from "react";
import TextInput from "../../components/inputComponents/TextInput";
import Button from "../../components/basicComponents/Button";
import { apiClient } from "../../utility/ApiClient";
import type { GrantProgram } from "../../types/grantProgram";

interface GrantNameProps {
  id: string;
  name: string;
  grantProgram: GrantProgram;
  onGrantProgramChange: (updated: GrantProgram) => void;
  error?: boolean | string;
  required?: boolean;
}

const GrantName: React.FC<GrantNameProps> = ({
  id,
  name,
  grantProgram,
  onGrantProgramChange,
  error = false,
  required = true,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

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
      // Send the entire GrantProgram object
      console.log(grantProgram);
      const response = await apiClient.post("/api/grant-programs", grantProgram);
      if (response.success) {
        setSubmitSuccess("Grant name saved successfully!");
      } else {
        setSubmitError(response.message || "Failed to save grant name.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to save grant name.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-group">
      <TextInput
        id={id}
        name={name}
        label="Grant Name"
        placeholder="Enter the grant program name"
        value={grantProgram.title}
        onChange={handleInputChange}
        required={required}
        error={error}
        autoComplete="off"
      />
      <Button
        text={isSubmitting ? "Saving..." : "Save Grant Name"}
        disabled={isSubmitting || !grantProgram.title}
        onClick={handleSubmit}
      />
      {submitError && <div className="error-message">{submitError}</div>}
      {submitSuccess && <div className="success-message">{submitSuccess}</div>}
    </div>
  );
};

export default GrantName;