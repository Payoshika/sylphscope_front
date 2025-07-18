import React, { useState } from "react";
import TextInput from "../../components/inputComponents/TextInput";
import Button from "../../components/basicComponents/Button";
import TitleAndHeadLine from "../createGrantProgram/TitleAndHeadLine";
import type { Provider } from "../../types/provider";


interface OrganisationNameProps {
  organisation: Provider;
  onOrganisationChange: (updated: Provider) => void;
  providerStaff: ProviderStaff;
  onUpdateProvider: (provider: Provider) => Promise<any>;
}

const OrganisationName: React.FC<OrganisationNameProps> = ({
  organisation,
  onOrganisationChange,
  providerStaff,
  onUpdateProvider,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOrganisationChange({ ...organisation, organisationName: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
        console.log("updating provider info");
      const response = await onUpdateProvider(organisation);
      console.log("updated provider info", response);
      onOrganisationChange({ ...organisation, ...response.data });
      setSubmitSuccess("Organisation name saved.");
    } catch (err) {
      setSubmitError("Failed to update organisation name.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="content">
      <TitleAndHeadLine title="Organisation Name" headline="Create a new organisation" provider={true} />
      <form className="form-group" onSubmit={handleSubmit}>
    <TextInput
    id="organisation-name"
    name="organisationName"
    label="Organisation Name"
    placeholder="Enter the organisation name"
    value={organisation.organisationName ?? ""}
    onChange={handleInputChange}
    required
    />
    <Button
    text={isSubmitting ? "Saving..." : "Save Organisation Name"}
    disabled={isSubmitting || !organisation.organisationName}
      type="submit"
    />
        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">{submitSuccess}</div>}
      </form>
    </div>
  );
};

export default OrganisationName;