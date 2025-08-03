import React from "react";
import type { GrantProgram } from "../../types/grantProgram";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

interface GrantOverviewProps {
  grantProgram: GrantProgram | null;
}

const GrantOverview: React.FC<GrantOverviewProps> = ({ grantProgram }) => {
  if (!grantProgram) {
    return (
      <div className="content">
        <TitleAndHeadLine
          title="Grant Overview"
          headline="No grant program information available"
          student={true}
        />
        <div className="no-data-message">
          <p>No grant program information available.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Grant Overview"
        headline="Review the grant program details before applying"
        student={true}
      />
      
      <div className="grant-overview-section">
        <div className="grant-header">
          <h3>{grantProgram.title}</h3>
          <div className="grant-status">
            <span className={`status-badge status-${grantProgram.status.toLowerCase()}`}>
              {grantProgram.status}
            </span>
          </div>
        </div>

        <div className="grant-description">
          <p>{grantProgram.description}</p>
        </div>

        <div className="grant-details">
          <div className="detail-item">
            <strong>Grant ID:</strong>
            <span>{grantProgram.id}</span>
          </div>
          <div className="detail-item">
            <strong>Provider:</strong>
            <span>{grantProgram.providerName}</span>
          </div>
          <div className="detail-item">
            <strong>Application Start Date:</strong>
            <span>{formatDate(grantProgram.schedule?.applicationStartDate)}</span>
          </div>
          <div className="detail-item">
            <strong>Application End Date:</strong>
            <span>{formatDate(grantProgram.schedule?.applicationEndDate)}</span>
          </div>
          <div className="detail-item">
            <strong>Decision Date:</strong>
            <span>{formatDate(grantProgram.schedule?.decisionDate)}</span>
          </div>
          <div className="detail-item">
            <strong>Fund Disbursement Date:</strong>
            <span>{formatDate(grantProgram.schedule?.fundDisbursementDate)}</span>
          </div>
          {grantProgram.award && grantProgram.award.length > 0 && (
            <div className="detail-item">
              <strong>Award Amounts:</strong>
              <span>{grantProgram.award.map(amount => `$${amount.toLocaleString()}`).join(', ')}</span>
            </div>
          )}
          {grantProgram.numOfAward && (
            <div className="detail-item">
              <strong>Number of Awards:</strong>
              <span>{grantProgram.numOfAward}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default GrantOverview;