import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { GrantProgram } from '../../types/grantProgram';
import type { Provider } from '../../types/provider';
import { getGrantProgramsByStudentId, searchGrantProgramsByTitle } from '../../services/GrantProgramService';
import { getProviderById } from '../../services/ProviderService';
import GrantListTable from '../../components/basicComponents/GrantListTable';
import TitleAndHeadLine from '../../components/TitleAndHeadLine';
import type { Student } from '../../types/student';

const GrantList: React.FC = () => {
  const { student } = useOutletContext<{
    student: Student;
    setStudent: (s: Student) => void;
    updateStudent: (s: Student) => Promise<Student>;
  }>();
  const [grantPrograms, setGrantPrograms] = useState<GrantProgram[]>([]);
  const [providers, setProviders] = useState<Record<string, Provider>>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGrantPrograms();
  }, [student?.id]);

  const fetchGrantPrograms = async () => {
    try {
      setIsLoading(true);
      const response = await getGrantProgramsByStudentId(student.id, 0, 10);
      setGrantPrograms(response.content);
      
      // Fetch provider details for each grant program
      const providerPromises = response.content.map(grant => 
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
      console.error('Failed to fetch grant programs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    try {
      setIsLoading(true);
      if (!searchTerm.trim()) {
        await fetchGrantPrograms();
        return;
      }
      
      const searchResponse = await searchGrantProgramsByTitle(searchTerm);
      const searchResults = searchResponse.content;
      setGrantPrograms(searchResults);
      
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
      console.error('Failed to search grant programs:', error);
      // On error, fetch all grants
      // await fetchGrantPrograms();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string, direction: 'asc' | 'desc', sortedGrants?: GrantProgram[]) => {
    if (sortedGrants) {
      // Use the pre-sorted grants from GrantListTable
      setGrantPrograms(sortedGrants);
      return;
    }
    
    // Fallback to manual sorting (shouldn't be needed now)
    setGrantPrograms(prev => {
      const sorted = [...prev].sort((a, b) => {
        let aValue: any = a[key as keyof GrantProgram];
        let bValue: any = b[key as keyof GrantProgram];
        
        if (key === 'schedule') {
          aValue = getNextSchedule(a);
          bValue = getNextSchedule(b);
        } else if (key === 'amount') {
          aValue = a.award && a.award.length > 0 ? a.award[0] : 0;
          bValue = b.award && b.award.length > 0 ? b.award[0] : 0;
        } else if (key === 'organisation') {
          aValue = providers[a.providerId]?.organisationName || '';
          bValue = providers[b.providerId]?.organisationName || '';
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

  const handleViewDetail = (grantId: string) => {
    navigate(`/student-application/${grantId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Available Grants"
        headline="Explore and apply for available grant programs"
      />
      <GrantListTable
        grants={grantPrograms}
        providers={providers}
        onSearch={handleSearch}
        onSort={handleSort}
        onViewDetail={handleViewDetail}
        getNextSchedule={getNextSchedule}
      />
    </div>
  );
};

export default GrantList;