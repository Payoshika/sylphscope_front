import React, { useEffect, useState } from "react";
import type { Provider } from "../../types/provider";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getGrantProgramsByProviderId } from "../../services/GrantProgramService";
import { getApplicationCountByGrantProgramId } from "../../services/ApplicationService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import GrantListTable from "../../components/basicComponents/GrantListTable";

interface GrantProgramWithApplicationCount extends GrantProgram {
  applicationCount: number;
}

interface ListGrantsProps {
  provider: Provider;
  grantPrograms: GrantProgram[];
  loading: boolean;
}

const ListGrants: React.FC<ListGrantsProps> = ({ provider, grantPrograms: initialGrantPrograms, loading: initialLoading }) => {
  const [grantPrograms, setGrantPrograms] = useState<GrantProgramWithApplicationCount[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrantProgramsWithApplicationCounts();
  }, [initialGrantPrograms, initialLoading]);

  const fetchGrantProgramsWithApplicationCounts = async () => {
    try {
      setLoading(true);
      
      // Fetch application counts for each grant program
      const grantProgramsWithCounts = await Promise.all(
        initialGrantPrograms.map(async (grant) => {
          try {
            const applicationCount = await getApplicationCountByGrantProgramId(grant.id);
            return {
              ...grant,
              applicationCount
            };
          } catch (error) {
            console.error(`Failed to fetch application count for grant ${grant.id}:`, error);
            return {
              ...grant,
              applicationCount: 0
            };
          }
        })
      );
      setGrantPrograms(grantProgramsWithCounts);
    } catch (error) {
      console.error('Failed to fetch grant programs with application counts:', error);
      // Fallback to original grants without counts
      setGrantPrograms(initialGrantPrograms.map(grant => ({ ...grant, applicationCount: 0 })));
    } finally {
      setLoading(false);
    }
  };

  const handleManageGrant = (grantId: string) => {
    navigate(`/create-grant/${grantId}`);
  };

  const handleReviewApplicants = (grantId: string) => {
    navigate(`/grant-management/mark-application/${grantId}`);
  };

  const handleViewDetail = (grantId: string, status: string) => {
    // Check if the grant status allows for reviewing applicants
    if (status === 'OPEN' || status === 'IN_REVIEW' || status === 'CLOSED') {
      handleReviewApplicants(grantId);
    } else {
      handleManageGrant(grantId);
    }
  };

  const getNextSchedule = (grant: GrantProgramWithApplicationCount) => {
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
    setGrantPrograms(prev => {
      const sorted = [...prev].sort((a, b) => {
        let aValue: any = a[key as keyof GrantProgramWithApplicationCount];
        let bValue: any = b[key as keyof GrantProgramWithApplicationCount];
        
        // Special handling for schedule
        if (key === 'schedule') {
          aValue = getNextSchedule(a);
          bValue = getNextSchedule(b);
        }
        
        // Special handling for applicants (application count)
        if (key === 'applicants') {
          aValue = a.applicationCount;
          bValue = b.applicationCount;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' ? 
            aValue.localeCompare(bValue) : 
            bValue.localeCompare(aValue);
        }
        return direction === 'asc' ? 
          (aValue > bValue ? 1 : -1) : 
          (bValue > aValue ? 1 : -1);
      });
      return sorted;
    });
  };

  const handleSearch = async (searchTerm: string) => {
    // For now, we'll just filter the existing grants by title
    // In the future, this could be enhanced to search on the backend
    if (!searchTerm.trim()) {
      await fetchGrantProgramsWithApplicationCounts();
      return;
    }
    
    const filteredGrants = grantPrograms.filter(grant => 
      grant.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setGrantPrograms(filteredGrants);
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
          onViewDetail={(grantId) => handleViewDetail(grantId, grantPrograms.find(g => g.id === grantId)?.status || '')}
          getNextSchedule={getNextSchedule}
          onSort={handleSort}
          onSearch={handleSearch}
          headers={[
            { label: "Grant Name", key: "title" },
            { label: "Status", key: "status" },
            { label: "Expected next schedule", key: "schedule" },
            { label: "Applicants", key: "applicants" },
            { label: "Actions", key: "actions" },
          ]}
          getActionText={(grant: GrantProgramWithApplicationCount) => {
            const status = grant.status;
            if (status === 'OPEN' || status === 'IN_REVIEW' || status === 'CLOSED') {
              return "Review Applicants";
            }
            return "View Detail";
          }}
        />
      )}
    </div>
  );
};

export default ListGrants;