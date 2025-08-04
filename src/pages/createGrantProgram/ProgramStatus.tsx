import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/basicComponents/Button";
import Card from "../../components/basicComponents/Card";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import { makeProgramPublic, closeProgram } from "../../services/GrantProgramService";
import type { GrantProgram } from "../../types/grantProgram";
import { GrantStatus } from "../../types/grantProgram";

interface ProgramStatusProps {
  grantProgram: GrantProgram;
  onGrantProgramChange: (grantProgram: GrantProgram) => void;
}

const ProgramStatus: React.FC<ProgramStatusProps> = ({ grantProgram, onGrantProgramChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleMakePublic = async () => {
    if (grantProgram.status !== GrantStatus.DRAFT) {
      setError("Only draft programs can be made public");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedGrantProgram = await makeProgramPublic(grantProgram.id);
      onGrantProgramChange(updatedGrantProgram);
      setSuccess(true);
      
      // Redirect to grant management after a short delay
      setTimeout(() => {
        navigate("/grant-management");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to make program public");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseProgram = async () => {
    if (grantProgram.status !== GrantStatus.OPEN) {
      setError("Only open programs can be closed");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedGrantProgram = await closeProgram(grantProgram.id);
      onGrantProgramChange(updatedGrantProgram);
      setSuccess(true);
      
      // Redirect to grant management after a short delay
      setTimeout(() => {
        navigate("/grant-management");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close program");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      [GrantStatus.DRAFT]: "Draft",
      [GrantStatus.OPEN]: "Open",
      [GrantStatus.CLOSED]: "Closed",
      [GrantStatus.ARCHIVED]: "Archived"
    };
    return statusMap[status] || status;
  };

  const canMakePublic = grantProgram.status === GrantStatus.DRAFT;
  const canCloseProgram = grantProgram.status === GrantStatus.OPEN;

  return (
    <div className="program-status-section">
      <TitleAndHeadLine 
        title="Program Status" 
        headline="Manage your grant program status"
      />

      <Card>
        <div className="grant-summary">
          <h3>Grant Program Summary</h3>
          
          <div className="summary-grid">
            <div className="summary-item">
              <strong>Title:</strong> {grantProgram.title}
            </div>
            
            <div className="summary-item">
              <strong>Description:</strong> {grantProgram.description}
            </div>
            
            <div className="summary-item">
              <strong>Current Status:</strong> 
              <span className={`status-badge status-${grantProgram.status.toLowerCase()}`}>
                {getStatusDisplay(grantProgram.status)}
              </span>
            </div>
            
            <div className="summary-item">
              <strong>Provider:</strong> {grantProgram.providerName}
            </div>
            
            <div className="summary-item">
              <strong>Application Start Date:</strong> {formatDate(grantProgram.schedule.applicationStartDate)}
            </div>
            
            <div className="summary-item">
              <strong>Application End Date:</strong> {formatDate(grantProgram.schedule.applicationEndDate)}
            </div>
            
            <div className="summary-item">
              <strong>Decision Date:</strong> {formatDate(grantProgram.schedule.decisionDate)}
            </div>
            
            <div className="summary-item">
              <strong>Fund Disbursement Date:</strong> {formatDate(grantProgram.schedule.fundDisbursementDate)}
            </div>
            
            <div className="summary-item">
              <strong>Questions:</strong> {grantProgram.questionIds?.length || 0} questions
            </div>
            
            <div className="summary-item">
              <strong>Selection Criteria:</strong> {grantProgram.selectionCriteria?.length || 0} criteria
            </div>
            
            <div className="summary-item">
              <strong>Assigned Staff:</strong> {grantProgram.assignedStaffIds?.length || 0} staff members
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            Grant program status has been successfully updated! Redirecting to grant management...
          </div>
        )}

        <div className="action-buttons">
          {canMakePublic ? (
            <Button
              onClick={handleMakePublic}
              disabled={isSubmitting}
              text={isSubmitting ? "Making Public..." : "Make Program Public"}
            />
          ) : canCloseProgram ? (
            <Button
              onClick={handleCloseProgram}
              disabled={isSubmitting}
              text={isSubmitting ? "Closing Program..." : "Close Program"}
            />
          ) : (
            <div className="status-notice">
              <p>This program's status is "{getStatusDisplay(grantProgram.status)}".</p>
              <p>Only draft programs can be made public, and only open programs can be closed.</p>
            </div>
          )}
          
          <Button
            onClick={() => navigate("/grant-management")}
            variant="ghost"
            text="Back to Grant Management"
          />
        </div>
      </Card>
    </div>
  );
};

export default ProgramStatus; 