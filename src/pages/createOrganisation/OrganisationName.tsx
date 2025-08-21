import React, { useState } from "react";
import TextInput from "../../components/inputComponents/TextInput";
import Button from "../../components/basicComponents/Button";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import type { Provider } from "../../types/provider";
import { useOutletContext } from "react-router-dom";
import type { ProviderStaff } from "../../types/user";

interface OrganisationNameProps {
  organisation: Provider;
  onOrganisationChange: (updated: Provider) => void;
  onUpdateProvider: (provider: Provider) => Promise<any>;
}

const OrganisationName: React.FC<OrganisationNameProps> = ({
  organisation,
  onOrganisationChange,
  onUpdateProvider,
}) => {
  const { providerStaff } = useOutletContext<{ providerStaff?: ProviderStaff; provider?: Provider }>();
  const isManager = (providerStaff?.role || "").toString().toLowerCase() === "manager";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOrganisationChange({ ...organisation, organisationName: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isManager) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const response = await onUpdateProvider(organisation);
      onOrganisationChange({ ...organisation, ...response.data });
      setSubmitSuccess("Organisation name saved.");
    } catch (err) {
      setSubmitError("Failed to update organisation name.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <TitleAndHeadLine title="Organisation Name" headline="Set Your Organisation Name" provider={true} />
      {isManager ? (
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
      ) : (
        <div className="form-group">
          <label>Organisation Name</label>
          <div className="read-only-field">
            {organisation.organisationName ? (
              <p>{organisation.organisationName}</p>
            ) : (
              <p className="muted">No organisation name set</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganisationName;