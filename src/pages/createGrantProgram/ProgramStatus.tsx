import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Button from "../../components/basicComponents/Button";
import Card from "../../components/basicComponents/Card";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import { makeProgramPublic, closeProgram } from "../../services/GrantProgramService";
import type { GrantProgram } from "../../types/grantProgram";
import { GrantStatus } from "../../types/grantProgram";
import type { ProviderStaff } from "../../types/user";

interface ProgramStatusProps {
  grantProgram: GrantProgram;
  onGrantProgramChange: (grantProgram: GrantProgram) => void;
}

const ProgramStatus: React.FC<ProgramStatusProps> = ({ grantProgram, onGrantProgramChange }) => {
  const { providerStaff } = useOutletContext<{ providerStaff?: ProviderStaff }>();
  const isManager = (providerStaff?.role || "").toString().toUpperCase() === "MANAGER";
  const isEditor = ["MANAGER", "ADMINISTRATOR"].includes((providerStaff?.role || "").toString().toUpperCase());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Restrict actions by role:
  const canMakePublic = grantProgram.status === GrantStatus.DRAFT && isManager;
  const canCloseProgram = grantProgram.status === GrantStatus.OPEN && isEditor;

  const handleMakePublic = async () => {
    if (!isManager) {
      setError("Only Manager can make a program public");
      return;
    }
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
    if (!isEditor) {
      setError("Only Manager or Administrator can close a program");
      return;
    }
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

  return (
    <div className="content">
      <TitleAndHeadLine 
        title="Program Status" 
        headline="Manage your grant program status"
        provider={true}
      />
      <div className="staff-management-container">
        <div className="grant-summary">
          <h3>Grant Program Summary</h3>
          
          <div className="summary-grid">
            <div className="summary-item">
              <p><strong>Title:</strong> <span className="value">{grantProgram.title}</span></p>
            </div>
            
            <div className="summary-item">
              <p><strong>Description:</strong></p>
              <p className="value">{grantProgram.description}</p>
            </div>
            
            <div className="summary-item">
              <p>
                <strong>Current Status:</strong>
                <span className={`status-badge status-${grantProgram.status.toLowerCase()}`} style={{ marginLeft: 8 }}>
                  {getStatusDisplay(grantProgram.status)}
                </span>
              </p>
            </div>
            
            <div className="summary-item">
              <p><strong>Provider:</strong> <span className="value">{grantProgram.providerName}</span></p>
            </div>
            
            <div className="summary-item">
              <p><strong>Application Start Date:</strong> <span className="value">{formatDate(grantProgram.schedule.applicationStartDate)}</span></p>
            </div>
            
            <div className="summary-item">
              <p><strong>Application End Date:</strong> <span className="value">{formatDate(grantProgram.schedule.applicationEndDate)}</span></p>
            </div>
            
            <div className="summary-item">
              <p><strong>Decision Date:</strong> <span className="value">{formatDate(grantProgram.schedule.decisionDate)}</span></p>
            </div>
            
            <div className="summary-item">
              <p><strong>Fund Disbursement Date:</strong> <span className="value">{formatDate(grantProgram.schedule.fundDisbursementDate)}</span></p>
            </div>
            
            <div className="summary-item">
              <p><strong>Questions:</strong> <span className="value">{grantProgram.questionIds?.length || 0} questions</span></p>
            </div>
            
            <div className="summary-item">
              <p><strong>Selection Criteria:</strong> <span className="value">{grantProgram.selectionCriteria?.length || 0} criteria</span></p>
            </div>
            
            <div className="summary-item">
              <p><strong>Assigned Staff:</strong> <span className="value">{grantProgram.assignedStaff?.length || 0} staff members</span></p>
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
              size="large"
            />
          ) : canCloseProgram ? (
            <Button
              onClick={handleCloseProgram}
              disabled={isSubmitting}
              text={isSubmitting ? "Closing Program..." : "Close Program"}
              size="large"
            />
          ) : (
            <div className="status-notice">
              <p>
                {grantProgram.status === GrantStatus.DRAFT
                  ? "Only users with the Manager role can make this program public."
                  : grantProgram.status === GrantStatus.OPEN
                  ? "Only users with Manager or Administrator role can close this program."
                  : `This program's status is "${grantProgram.status}".`}
              </p>
            </div>
          )}

          <Button
            onClick={() => navigate("/grant-management")}
            variant="ghost"
            text="Back to Grant Management"
          />
        </div>
      </div>
    </div>
  );
};

export default ProgramStatus;