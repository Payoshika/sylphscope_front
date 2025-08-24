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
  onSort?: (key: string, direction: 'asc' | 'desc', sortedGrants?: any[]) => void;
  onViewDetail?: (grantId: string) => void;
  headers?: Array<{ label: string; key: string }>;
  getActionText?: (grant: any) => string;
}

const DEFAULT_HEADERS = [
  { label: "Grant Name", key: "title" },
  { label: "Organisation", key: "organisation" },
  { label: "Grant Status", key: "status" },
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

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortState({ key, direction });
    
    // Handle special sorting cases locally in the table component
    const sortedGrants = [...grants].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (key) {
        case "schedule":
          // Sort by next schedule date value
          aValue = getNextSchedule?.(a) || "";
          bValue = getNextSchedule?.(b) || "";
          // Extract date for proper sorting if it contains a date
          const aDateMatch = aValue.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
          const bDateMatch = bValue.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
          if (aDateMatch && bDateMatch) {
            aValue = new Date(aDateMatch[0]).getTime();
            bValue = new Date(bDateMatch[0]).getTime();
          } else {
            // If no date found, sort alphabetically by the text
            aValue = aValue.toString();
            bValue = bValue.toString();
          }
          break;
        case "amount":
          // Sort by first award amount
          aValue = a.award && a.award.length > 0 ? a.award[0] : 0;
          bValue = b.award && b.award.length > 0 ? b.award[0] : 0;
          break;
        case "title":
          aValue = a.title || "";
          bValue = b.title || "";
          break;
        case "organisation":
          const providerA = providers[a.providerId];
          const providerB = providers[b.providerId];
          aValue = providerA?.organisationName || a.providerId || "";
          bValue = providerB?.organisationName || b.providerId || "";
          break;
        case "status":
          aValue = a.status || "";
          bValue = b.status || "";
          break;
        case "applicants":
          aValue = a.applicationCount || 0;
          bValue = b.applicationCount || 0;
          break;
        default:
          aValue = a[key as keyof typeof a] || "";
          bValue = b[key as keyof typeof b] || "";
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' ? 
          aValue.localeCompare(bValue) : 
          bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? 
          aValue - bValue : 
          bValue - aValue;
      }
      
      return 0;
    });
    
    // Call parent's onSort with the sorted data
    onSort?.(key, direction, sortedGrants);
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
              onClick={() => handleSort(header.key, sortState?.direction === 'asc' ? 'desc' : 'asc')} 
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
                  cellContent = (grant.applicationCount?.toString() || "0") + " / " + (grant.numOfAward ? grant.numOfAward : "-");
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