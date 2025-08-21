import React, { useState } from "react";
import Textarea from "../../components/inputComponents/Textarea";
import Button from "../../components/basicComponents/Button";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import type { Provider } from "../../types/provider";
import { useOutletContext } from "react-router-dom";
import type { ProviderStaff } from "../../types/user";

interface OrganisationDescriptionProps {
  organisation: Provider;
  onOrganisationChange: (updated: Provider) => void;
  onUpdateProvider: (provider: Provider) => Promise<any>;
}

const OrganisationDescription: React.FC<OrganisationDescriptionProps> = ({
  organisation,
  onOrganisationChange,
  onUpdateProvider,
}) => {
  const { providerStaff } = useOutletContext<{ providerStaff?: ProviderStaff; provider?: Provider }>();
  const isManager = (providerStaff?.role || "").toString().toLowerCase() === "manager";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onOrganisationChange({ ...organisation, organisationDescription: e.target.value });
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
      setSubmitSuccess("Organisation description saved.");
    } catch (err) {
      setSubmitError("Failed to update organisation description.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="content">
      <TitleAndHeadLine title="Organisation Description" headline="Provide a detailed description of the organisation" provider={true} />
      {isManager ? (
        <form className="form-group" onSubmit={handleSubmit}>
          <Textarea
            id="organisation-description"
            name="organisationDescription"
            label="Organisation Description"
            placeholder="Enter the organisation description"
            value={organisation.organisationDescription ?? ""}
            onChange={handleInputChange}
            required
            rows={6}
          />
          <Button
            text={isSubmitting ? "Saving..." : "Save Description"}
            disabled={isSubmitting || !organisation.organisationDescription}
            type="submit"
          />
          {submitError && <div className="error-message">{submitError}</div>}
          {submitSuccess && <div className="success-message">{submitSuccess}</div>}
        </form>
      ) : (
        <div className="form-group">
          <label>Organisation Description</label>
          <div className="read-only-field">
            {organisation.organisationDescription ? (
              <p>{organisation.organisationDescription}</p>
            ) : (
              <p className="muted">No description set</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganisationDescription;