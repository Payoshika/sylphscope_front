import React, { useState } from 'react';
import InputText from '../inputComponents/TextInput';
import Button from './Button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sorting01Icon, Sorting02Icon, Sorting05Icon } from '@hugeicons/core-free-icons';

interface GrantListTableProps {
  grants: any[];
  providers: Record<string, any>;
  onApply?: (grantId: string) => void;
  getNextSchedule?: (grant: any) => string;
  onSearch: (searchTerm: string) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onViewDetail?: (grantId: string) => void;
  headers?: Array<{ label: string; key: string }>;
  getActionText?: (grant: any) => string;
}

const DEFAULT_HEADERS = [
  { label: "Grant Name", key: "title" },
  { label: "Organisation", key: "organisation" },
  { label: "Application Status", key: "status" },
  { label: "Expected next schedule", key: "schedule" },
  { label: "Grant Amount", key: "amount" }
];

const GrantListTable: React.FC<GrantListTableProps> = ({ 
  grants, 
  providers, 
  getNextSchedule, 
  onSearch,
  onSort,
  onViewDetail,
  headers = DEFAULT_HEADERS,
  getActionText
}) => {
  const [search, setSearch] = useState('');
  const [sortState, setSortState] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(search);
    }
  };

  const handleSort = (key: string) => {
    const newDirection = sortState?.key === key && sortState.direction === 'asc' ? 'desc' : 'asc';
    setSortState({ key, direction: newDirection });
    onSort?.(key, newDirection);
  };

  return (
    <div className="grantlist-outer">
      <div className="grantlist-search-row">
        <div className="search-container">
          <InputText
            id="grantlist-search"
            name="grantlist-search"
            label=""
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            placeholder="Search Grant by keyword"
            size="large"
          />
          <Button
            text="Search"
            onClick={handleSearchSubmit}
            type="button"
            variant="primary"
          />
        </div>
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
              <HugeiconsIcon 
                icon={sortState?.key === header.key 
                  ? (sortState.direction === 'asc' ? Sorting01Icon : Sorting02Icon) 
                  : Sorting05Icon
                } 
                size={18}
              />
            </button>
          </div>
        ))}
      </div>
      {grants.map((grant) => {
        const provider = providers[grant.providerId];
        return (
          <div 
            className="grantlist-grid-row grantlist-row-clickable" 
            key={grant.id} 
            tabIndex={0} 
            onClick={() => onViewDetail?.(grant.id)}
            onKeyDown={e => { if (e.key === 'Enter') onViewDetail?.(grant.id); }}
          >
            {headers.map((header) => {
              let cellContent = "";
              
              switch (header.key) {
                case "title":
                  cellContent = grant.title;
                  break;
                case "organisation":
                  cellContent = provider?.organisationName || grant.providerId;
                  break;
                case "status":
                  cellContent = grant.status;
                  break;
                case "schedule":
                  cellContent = getNextSchedule?.(grant) || "-";
                  break;
                case "amount":
                  cellContent = grant.award && grant.award.length > 0 ? grant.award.join(" - ") : "-";
                  if (grant.numOfAward) {
                    cellContent += ` / ${grant.numOfAward}`;
                  }
                  break;
                case "applicants":
                  cellContent = (grant.numOfAward ? grant.numOfAward : "-") + " / " + (grant.applicationCount?.toString() || "0");
                  break;
                case "actions":
                  cellContent = getActionText?.(grant) || "View Detail";
                  break;
                default:
                  cellContent = grant[header.key as keyof typeof grant]?.toString() || "-";
              }
              
              return (
                <div className="grantlist-grid-cell grantlist-value-cell" key={header.key}>
                  <span>{cellContent}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GrantListTable; 