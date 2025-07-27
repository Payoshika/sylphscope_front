import React, { useState } from "react";
import type { GrantProgram } from "../../types/grantProgram";
import type { Provider } from "../../types/provider";
import {Sorting05Icon, Sorting01Icon, Sorting02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import InputText from "../inputComponents/TextInput";

interface GrantListTableProps {
  grants: GrantProgram[];
  providers: Record<string, Provider>;
  onApply?: (grantId: string) => void;
  getNextSchedule: (grant: GrantProgram) => string;
  onSearch?: (query: string) => void;
  onSort?: (headerKey: string, direction: 'asc' | 'desc') => void;
  onViewDetail?: (grantId: string) => void;
}

const HEADERS = [
  { label: "Grant Name", key: "title" },
  { label: "Organisation", key: "organisation" },
  { label: "Application Status", key: "status" },
  { label: "Expected next schedule", key: "schedule" },
  { label: "Grant Amount", key: "amount" },
  { label: "", key: "viewdetail" }
];

const GrantListTable: React.FC<GrantListTableProps> = ({ grants, providers, onApply, getNextSchedule, onSearch, onSort, onViewDetail }) => {
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
          id="grantlist-search"
          name="grantlist-search"
          label=""
          value={search}
          onChange={handleSearchChange}
          placeholder="Search Grant by keyword"
          size="large"
        />
      </div>
      <div className="grantlist-header-row">
        {HEADERS.map((header, i) => (
          <div className="grantlist-header-cell" key={header.key}>
            <span>{header.label}</span>
            {i !== HEADERS.length - 1 && (
              <button
                className="grantlist-sort-btn"
                onClick={() => handleSort(header.key)}
                aria-label={`Sort by ${header.label}`}
                type="button"
              >
                {sortState?.key === header.key ? (sortState.direction === 'asc' ? <HugeiconsIcon icon={Sorting01Icon} size={18}/> : <HugeiconsIcon icon={Sorting02Icon} size={18}/>) : <HugeiconsIcon icon={Sorting05Icon} size={18}/>}            </button>
            )}
          </div>
        ))}
      </div>
      {grants.map((grant, rowIndex) => {
        const provider = providers[grant.providerId];
        return (
          <div className="grantlist-grid-row" key={grant.id}>
            <div className="grantlist-grid-cell grantlist-value-cell"><span>{grant.title}</span></div>
            <div className="grantlist-grid-cell grantlist-value-cell"><span>{provider?.organisationName || grant.providerId}</span></div>
            <div className="grantlist-grid-cell grantlist-value-cell"><span>{grant.status}</span></div>
            <div className="grantlist-grid-cell grantlist-value-cell"><span>{getNextSchedule(grant)}</span></div>
            <div className="grantlist-grid-cell grantlist-value-cell"><span>{grant.award && grant.award.length > 0 ? grant.award.join(" - ") : "-"}</span></div>
            <div className="grantlist-grid-cell grantlist-value-cell grantlist-contact-cell">
              <button className="grantlist-contact-btn" title="View Detail" onClick={() => onViewDetail?.(grant.id)}>
                View Detail
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GrantListTable; 