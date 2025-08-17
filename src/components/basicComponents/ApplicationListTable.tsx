import React, { useState } from "react";
import type { GrantProgramApplicationDto } from "../../types/application";
import type { Provider } from "../../types/provider";
import {Sorting05Icon, Sorting01Icon, Sorting02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Button from "../basicComponents/Button";

interface ApplicationListTableProps {
  applications: GrantProgramApplicationDto[];
  provider: Provider;
  onViewDetail?: (applicationId: string) => void;
  onSelect?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
  onSort?: (headerKey: string, direction: 'asc' | 'desc') => void;
  headers: { label: string; key: string }[];
  markingScores?: Record<string, number>;
  applicantNames?: Record<string, string>;
  appliedDates?: Record<string, string>;
}

const ApplicationListTable: React.FC<ApplicationListTableProps> = ({ 
  applications, 
  onViewDetail, 
  onSelect,
  onReject,
  onSort,
  headers,
  markingScores = {},
  applicantNames = {},
  appliedDates = {}
}) => {
  const [sortState, setSortState] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortState && sortState.key === key && sortState.direction === 'asc') {
      direction = 'desc';
    }
    setSortState({ key, direction });
    onSort?.(key, direction);
  };

  const handleSelect = (e: React.MouseEvent, applicationId: string) => {
    e.stopPropagation();
    onSelect?.(applicationId);
  };

  const handleReject = (e: React.MouseEvent, applicationId: string) => {
    e.stopPropagation();
    onReject?.(applicationId);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "selected":
        return { text: "Selected", className: "status-selected" };
      case "not selected":
        return { text: "Not Selected", className: "status-rejected" };
      case "draft":
        return { text: "Draft", className: "status-draft" };
      case "applied":
        return { text: "Applied", className: "status-applied" };
      case "under selection process":
        return { text: "Under Review", className: "status-review" };
      case "canceled":
        return { text: "Canceled", className: "status-canceled" };
      default:
        return { text: status, className: "status-default" };
    }
  };

  const shouldShowButtons = (status: string) => {
    return status !== "selected" && status !== "not selected";
  };

  for(const app of applications) {
    console.log(app.application);
  }

  return (
    <div className="grantlist-outer">
      <div className="grantlist-header-row">
        {headers.map((header) => (
          <div className="grantlist-header-cell" key={header.key}>
            <span>{header.label}</span>
            <button
              className="grantlist-sort-btn"
              onClick={() => handleSort(header.key)}
              aria-label={`Sort by ${header.label}`}
              type="button"
            >
              {sortState?.key === header.key ? (sortState.direction === 'asc' ? <HugeiconsIcon icon={Sorting01Icon} size={18}/> : <HugeiconsIcon icon={Sorting02Icon} size={18}/>) : <HugeiconsIcon icon={Sorting05Icon} size={18}/>}
            </button>
          </div>
        ))}
      </div>
      {applications.map((app) => (
        <div
          className="grantlist-grid-row grantlist-row-clickable"
          key={app.application.id}
          tabIndex={0}
          onClick={() => onViewDetail?.(app.application.id)}
          onKeyDown={e => { if (e.key === 'Enter') onViewDetail?.(app.application.id); }}
        >
          <div className="grantlist-grid-cell grantlist-value-cell">
            <span>{applicantNames[app.application.id] || `Student ${app.application.studentId}`}</span>
          </div>
          <div className="grantlist-grid-cell grantlist-value-cell">
            <span>{appliedDates[app.application.id] || "N/A"}</span>
          </div>
          <div className="grantlist-grid-cell grantlist-value-cell">
            <span>{app.application.eligibilityResult?.eligible ? "Eligible" : "Not Eligible"}</span>
          </div>
          <div className="grantlist-grid-cell grantlist-value-cell">
            <span>{markingScores[app.application.id] ? markingScores[app.application.id].toFixed(2) : "Not Marked"}</span>
          </div>
          <div className="grantlist-grid-cell grantlist-value-cell">
            {shouldShowButtons(app.application.status) ? (
              <div className="actions-container">
                <Button
                  text="Select"
                  type="button"
                  variant="primary"
                  onClick={(e) => handleSelect(e, app.application.id)}
                />
                <Button
                  text="Reject"
                  type="button"
                  variant="ghost"
                  onClick={(e) => handleReject(e, app.application.id)}
                />
              </div>
            ) : (
              <span className={`status-display ${getStatusDisplay(app.application.status).className}`}>
                {getStatusDisplay(app.application.status).text}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationListTable; 