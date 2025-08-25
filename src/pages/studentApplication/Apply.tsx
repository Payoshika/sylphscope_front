import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ApplicationDto, EligibilityResultDto } from "../../types/application";
import { applyGrant, getEligibilityResultByApplicationId } from "../../services/ApplicationService";
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
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResultDto | null>(null);
  const [loadingEligibility, setLoadingEligibility] = useState(true);

  const isAlreadyApplied = application.status === "applied";
  const isDraftStatus = application.status === "draft";
  const isEligible = eligibilityResult?.eligible ?? false;
  const canSubmit = isDraftStatus && !isAlreadyApplied && isEligible;
  const isDisabled = isSubmitting || !canSubmit || loadingEligibility;

  // Fetch eligibility result when component mounts
  useEffect(() => {
    const fetchEligibilityResult = async () => {
      try {
        setLoadingEligibility(true);
        console.log("Fetching eligibility result for application ID:", application.id);
        const result = await getEligibilityResultByApplicationId(application.id);
        setEligibilityResult(result);
        console.log("Eligibility result:", result);
      } catch (error) {
        console.error("Failed to fetch eligibility result:", error);
        // If we can't fetch eligibility, assume not eligible for safety
        setEligibilityResult({ 
          id: "", 
          studentId: application.studentId, 
          applicationId: application.id, 
          grantProgramId: application.grantProgramId, 
          eligible: false, 
          evaluatedAt: "", 
          updatedAt: "", 
          failedCriteria: [], 
          passedCriteria: [] 
        });
      } finally {
        setLoadingEligibility(false);
      }
    };

    fetchEligibilityResult();
  }, [application.id]);

  const getStatusMessage = () => {
    if (!isEligible && eligibilityResult) {
      return "You are not eligible for this grant program. Please review the eligibility criteria.";
    }
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
    if (!isEligible && eligibilityResult) {
      return "status-ineligible";
    }
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

  const getSubmitButtonText = () => {
    if (loadingEligibility) return "Checking Eligibility...";
    if (isSubmitting) return "Submitting...";
    if (!isEligible) return "Not Eligible";
    if (!isDraftStatus) return "Cannot Submit";
    return "Submit Application";
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
        navigate("/student-dashboard/applied");
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

  if (loadingEligibility) {
    return (
      <div className="content">
        <TitleAndHeadLine
          title="Submit Application"
          headline="Review and submit your grant application"
          provider={false}
        />
        <div className="loading-eligibility">
          <p>Checking eligibility...</p>
        </div>
      </div>
    );
  }

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
          <div className="summary-item">
            <strong>Eligibility Status:</strong>
            <span className={`status-display ${isEligible ? "status-eligible" : "status-ineligible"}`}>
              {isEligible ? "Eligible" : "Not Eligible"}
            </span>
          </div>
          {(application.status === "applied" || application.status === "selected" || application.status === "not selected") && (
            <div className="summary-item">
              <strong>Submitted:</strong> {new Date(application.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Show eligibility details if not eligible */}
        {eligibilityResult && !isEligible && (
          <div className="eligibility-details">
            <h4>Eligibility Details</h4>
            {eligibilityResult.failedCriteria.length > 0 && (
              <div className="failed-criteria">
                <p><strong>Failed Criteria:</strong></p>
                <ul>
                  {eligibilityResult.failedCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
            {eligibilityResult.passedCriteria.length > 0 && (
              <div className="passed-criteria">
                <p><strong>Passed Criteria:</strong></p>
                <ul>
                  {eligibilityResult.passedCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
          {!isAlreadyApplied && (
            <Button
              text="Cancel"
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            />
          )}
          <Button
            text={getSubmitButtonText()}
            type="button"
            variant="primary"
            onClick={handleApply}
            disabled={isDisabled}
          />
        </div>

        {isDraftStatus && isEligible && (
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

        {isDraftStatus && !isEligible && (
          <div className="ineligibility-notice">
            <h4>Eligibility Requirements Not Met</h4>
            <p>You must meet all eligibility criteria before submitting your application.</p>
            <p>Please review your answers in the eligibility section and ensure all requirements are satisfied.</p>
            <Button
              text="Review Eligibility"
              type="button"
              variant="outline"
              onClick={() => navigate(`/student-application/${grantProgramId}/eligibility`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Apply;