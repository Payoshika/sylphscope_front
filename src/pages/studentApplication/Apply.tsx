import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ApplicationDto } from "../../types/application";
import { applyGrant } from "../../services/ApplicationService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";

interface ApplyProps {
  application: ApplicationDto;
  grantProgramId: string;
}

const Apply: React.FC<ApplyProps> = ({ application, grantProgramId }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const isAlreadyApplied = application.status === "applied";
  const isDraftStatus = application.status === "draft";
  const canSubmit = isDraftStatus && !isAlreadyApplied;
  const isDisabled = isSubmitting || !canSubmit;

  const getStatusMessage = () => {
    switch (application.status) {
      case "draft":
        return "Your application is ready for submission.";
      case "applied":
        return "This application has already been submitted. You cannot submit it again.";
      case "selected":
        return "This application has been selected. No further action is required.";
      case "not selected":
        return "This application was not selected. You cannot submit it again.";
      case "under selection process":
        return "This application is currently under review. You cannot submit it again.";
      case "canceled":
        return "This application has been canceled. You cannot submit it again.";
      default:
        return "This application cannot be submitted at this time.";
    }
  };

  const getStatusColor = () => {
    switch (application.status) {
      case "draft":
        return "status-draft";
      case "applied":
        return "status-applied";
      case "selected":
        return "status-selected";
      case "not selected":
        return "status-rejected";
      case "under selection process":
        return "status-review";
      case "canceled":
        return "status-canceled";
      default:
        return "status-default";
    }
  };

  const handleApply = async () => {
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await applyGrant(application.id);
      setSubmitSuccess("Application submitted successfully!");
      // Redirect to student dashboard after a short delay
      setTimeout(() => {
        navigate("/student-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Failed to apply for grant:", error);
      setSubmitError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/student-application/${grantProgramId}/questions`);
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Submit Application"
        headline="Review and submit your grant application"
        provider={false}
      />
      
      <div className="apply-section">
        <div className="apply-header">
          <h3>Application Summary</h3>
          <p>Please review your application before submitting</p>
        </div>

        <div className="application-summary">
          <div className="summary-item">
            <strong>Application ID:</strong> {application.id}
          </div>
          <div className="summary-item">
            <strong>Current Status:</strong> 
            <span className={`status-display ${getStatusColor()}`}>
              {application.status}
            </span>
          </div>
          {(application.status === "applied" || application.status === "selected" || application.status === "not selected") && (
            <div className="summary-item">
              <strong>Submitted:</strong> {new Date(application.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className={`status-notice ${getStatusColor()}`}>
          <p>{getStatusMessage()}</p>
        </div>

        {submitError && (
          <div className="error-message">
            <p>{submitError}</p>
          </div>
        )}
        
        {submitSuccess && (
          <div className="success-message">
            <p>{submitSuccess}</p>
            <p>Redirecting to dashboard...</p>
          </div>
        )}

        <div className="apply-actions">
          <Button
            text="Cancel"
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          />
          <Button
            text={isSubmitting ? "Submitting..." : !isDraftStatus ? "Cannot Submit" : "Submit Application"}
            type="button"
            variant="primary"
            onClick={handleApply}
            disabled={isDisabled}
          />
        </div>

        {isDraftStatus && (
          <div className="apply-notice">
            <h4>Important Notice</h4>
            <ul>
              <li>Once submitted, you cannot edit your application</li>
              <li>Please ensure all information is correct before submitting</li>
              <li>You will receive a confirmation email upon successful submission</li>
              <li>You can track your application status from your dashboard</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Apply; 