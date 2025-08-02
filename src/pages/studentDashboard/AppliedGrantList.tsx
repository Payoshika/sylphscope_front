import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getGrantProgramAndApplicationByStudentId } from "../../services/ApplicationService";
import { searchAppliedGrantProgramByKeyword } from "../../services/GrantProgramService";
import { getProviderById } from "../../services/ProviderService";
import type { GrantProgramApplicationDto } from "../../types/application";
import type { Student } from "../../types/student";
import type { Provider } from "../../types/provider";
import type { GrantProgram } from "../../types/grantProgram";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import GrantListTable from "../../components/basicComponents/GrantListTable";

const AppliedGrantList: React.FC = () => {
  const { student } = useOutletContext<{ student: Student }>();
  const [appliedGrants, setAppliedGrants] = useState<GrantProgramApplicationDto[]>([]);
  const [providers, setProviders] = useState<Record<string, Provider>>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppliedGrants();
  }, [student?.id]);

  const fetchAppliedGrants = async () => {
    if (!student?.id) return;
    try {
      setIsLoading(true);
      const data = await getGrantProgramAndApplicationByStudentId(student.id);
      setAppliedGrants(data);
      
      // Fetch provider details for each grant program
      const providerPromises = data.map(item => 
        getProviderById(item.grantProgram.providerId).then(response => response.data)
      );
      const providerResults = await Promise.all(providerPromises);
      
      const providerMap: Record<string, Provider> = {};
      providerResults.forEach(provider => {
        if (provider) {
          providerMap[provider.id] = provider;
        }
      });
      setProviders(providerMap);
    } catch (err) {
      console.error('Failed to fetch applied grants:', err);
      // setAppliedGrants([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      if (!searchTerm.trim()) {
        await fetchAppliedGrants();
        return;
      }
      
      const searchResults = await searchAppliedGrantProgramByKeyword(student.id, searchTerm);
      
      // Convert search results to GrantProgramApplicationDto format
      const searchResultsAsDto: GrantProgramApplicationDto[] = searchResults.map(grant => ({
        grantProgram: grant,
        application: {
          id: '', // We don't have application details from search
          studentId: student.id,
          grantProgramId: grant.id,
          status: 'applied' as const, // Default status
          submittedAt: grant.createdAt,
          updatedAt: grant.updatedAt,
          eligibilityResult: {
            id: '',
            studentId: student.id,
            applicationId: '',
            grantProgramId: grant.id,
            eligible: true,
            evaluatedAt: grant.createdAt,
            updatedAt: grant.updatedAt,
            failedCriteria: [],
            passedCriteria: []
          },
          studentAnswers: {}
        }
      }));
      
      setAppliedGrants(searchResultsAsDto);
      
      // Fetch provider details for search results
      const providerPromises = searchResults.map(grant => 
        getProviderById(grant.providerId).then(response => response.data)
      );
      const providerResults = await Promise.all(providerPromises);
      
      const providerMap: Record<string, Provider> = {};
      providerResults.forEach(provider => {
        if (provider) {
          providerMap[provider.id] = provider;
        }
      });
      setProviders(providerMap);
    } catch (error) {
      console.error('Failed to search applied grant programs:', error);
      // On error, fetch all applied grants
      await fetchAppliedGrants();
    } finally {
      setIsLoading(false);
    }
  };

  // Map to GrantListTable expected props
  const grants = appliedGrants.map((item) => ({
    ...item.grantProgram,
    status: item.application.status,
    application: item.application,
  }));

  const getNextSchedule = (grant: GrantProgram): string => {
    const now = new Date();
    const dates = [
      { date: grant.schedule.applicationStartDate, label: 'Application Start' },
      { date: grant.schedule.applicationEndDate, label: 'Application End' },
      { date: grant.schedule.decisionDate, label: 'Decision' },
      { date: grant.schedule.fundDisbursementDate, label: 'Fund Disbursement' }
    ].filter(d => d.date && new Date(d.date) > now)
     .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
    
    return dates.length > 0 ? 
      `${dates[0].label}: ${new Date(dates[0].date!).toLocaleDateString()}` : 
      'No upcoming dates';
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setAppliedGrants(prev => {
      const sorted = [...prev].sort((a, b) => {
        let aValue: any = a.grantProgram[key as keyof typeof a.grantProgram];
        let bValue: any = b.grantProgram[key as keyof typeof b.grantProgram];
        
        if (key === 'organisation') {
          aValue = providers[a.grantProgram.providerId]?.organisationName || '';
          bValue = providers[b.grantProgram.providerId]?.organisationName || '';
        }
        
        if (key === 'schedule') {
          aValue = getNextSchedule(a.grantProgram);
          bValue = getNextSchedule(b.grantProgram);
        }
        
        if (key === 'amount') {
          aValue = a.grantProgram.award && a.grantProgram.award.length > 0 ? a.grantProgram.award[0] : 0;
          bValue = b.grantProgram.award && b.grantProgram.award.length > 0 ? b.grantProgram.award[0] : 0;
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

  const handleViewDetail = (grantId: string) => {
    navigate(`/student-application/${grantId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Applied Grants"
        headline="List of grants you have applied for"
        student={true}
      />
      {grants.length === 0 ? (
        <p>No applied grants to display.</p>
      ) : (
        <GrantListTable
          grants={grants}
          providers={providers}
          onSearch={handleSearch}
          onSort={handleSort}
          onViewDetail={handleViewDetail}
          getNextSchedule={getNextSchedule}
        />
      )}
    </div>
  );
};

export default AppliedGrantList;