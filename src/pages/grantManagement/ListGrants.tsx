import React, { useEffect, useState } from "react";
import type { Provider } from "../../types/provider";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getGrantProgramsByProviderId } from "../../services/GrantProgramService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import GrantListTable from "../../components/basicComponents/GrantListTable";

interface ListGrantsProps {
  provider: Provider;
  grantPrograms: GrantProgram[];
  loading: boolean;
}

const ListGrants: React.FC<ListGrantsProps> = ({ provider, grantPrograms: initialGrantPrograms, loading: initialLoading }) => {
  const [grantPrograms, setGrantPrograms] = useState<GrantProgram[]>(initialGrantPrograms);
  const [loading, setLoading] = useState(initialLoading);
  const [sortState, setSortState] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setGrantPrograms(initialGrantPrograms);
    setLoading(initialLoading);
  }, [initialGrantPrograms, initialLoading]);

  const handleManageGrant = (grantId: string) => {
    navigate(`/create-grant/${grantId}`);
  };

  const getNextSchedule = (grant: GrantProgram) => {
    const { schedule } = grant;
    if (!schedule) return "-";
    if (schedule.applicationStartDate && new Date(schedule.applicationStartDate) > new Date()) {
      return `Application opens: ${schedule.applicationStartDate.slice(0, 10)}`;
    }
    if (schedule.applicationEndDate && new Date(schedule.applicationEndDate) > new Date()) {
      return `Application closes: ${schedule.applicationEndDate.slice(0, 10)}`;
    }
    if (schedule.decisionDate && new Date(schedule.decisionDate) > new Date()) {
      return `Decision: ${schedule.decisionDate.slice(0, 10)}`;
    }
    if (schedule.fundDisbursementDate && new Date(schedule.fundDisbursementDate) > new Date()) {
      return `Fund Disbursement: ${schedule.fundDisbursementDate.slice(0, 10)}`;
    }
    return "-";
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortState({ key, direction });
    setGrantPrograms(prev => {
      const sorted = [...prev].sort((a, b) => {
        let aValue: any = a[key as keyof GrantProgram];
        let bValue: any = b[key as keyof GrantProgram];
        // Special handling for schedule
        if (key === 'schedule') {
          aValue = getNextSchedule(a);
          bValue = getNextSchedule(b);
        }
        // Special handling for amount
        if (key === 'amount') {
          aValue = a.award && a.award.length > 0 ? a.award[0] : 0;
          bValue = b.award && b.award.length > 0 ? b.award[0] : 0;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
      return sorted;
    });
  };

  if (loading) {
    return <div>Loading grants...</div>;
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Your Grants"
        headline="Manage your grant programs"
        provider={true}
      />
      {grantPrograms.length === 0 ? (
        <p>No grants to display.</p>
      ) : (
        <GrantListTable
          grants={grantPrograms}
          providers={{ [provider.id]: provider }}
          onViewDetail={handleManageGrant}
          getNextSchedule={getNextSchedule}
          onSort={handleSort}
          headers={[
            { label: "Grant Name", key: "title" },
            { label: "Status", key: "status" },
            { label: "Expected next schedule", key: "schedule" },
            { label: "Grant Amount / Receivers", key: "amount" },
            { label: "Actions", key: "actions" },
          ]}
        />
      )}
    </div>
  );
};

export default ListGrants;