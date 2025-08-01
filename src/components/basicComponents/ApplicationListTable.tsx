import React, { useState } from "react";
import type { GrantProgramApplicationDto } from "../../types/application";
import type { Provider } from "../../types/provider";
import {Sorting05Icon, Sorting01Icon, Sorting02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import InputText from "../inputComponents/TextInput";

interface ApplicationListTableProps {
  applications: GrantProgramApplicationDto[];
  provider: Provider;
  onViewDetail?: (applicationId: string) => void;
  onSearch?: (query: string) => void;
  onSort?: (headerKey: string, direction: 'asc' | 'desc') => void;
  headers: { label: string; key: string }[];
}

const ApplicationListTable: React.FC<ApplicationListTableProps> = ({ 
  applications, 
  provider, 
  onViewDetail, 
  onSearch, 
  onSort,
  headers 
}) => {
  const [search, setSearch] = useState("");
  const [sortState, setSortState] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortState && sortState.key === key && sortState.direction === 'asc') {
      direction = 'desc';
    }
    setSortState({ key, direction });
    onSort?.(key, direction);
  };

  return (
    <div className="grantlist-outer">
      <div className="grantlist-search-row">
        <InputText
          id="application-search"
          name="application-search"
          label=""
          value={search}
          onChange={handleSearchChange}
          placeholder="Search applications by grant name"
          size="large"
        />
      </div>
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
            <span>{app.grantProgram.title}</span>
          </div>
          <div className="grantlist-grid-cell grantlist-value-cell">
            <span>{new Date(app.application.submittedAt).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}</span>
          </div>
          <div className="grantlist-grid-cell grantlist-value-cell">
            <span>{app.application.status.charAt(0).toUpperCase() + app.application.status.slice(1)}</span>
          </div>
          <div className="grantlist-grid-cell grantlist-value-cell">
            <span>{app.application.eligibilityResult.isEligible ? "Eligible" : "Not Eligible"}</span>
          </div>
          <div className="grantlist-grid-cell grantlist-value-cell">
            <span>View Details</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationListTable; 