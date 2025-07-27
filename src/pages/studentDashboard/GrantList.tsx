import React, { useEffect, useState } from "react";
import type { Student } from "../../types/student";
import type { GrantProgram } from "../../types/grantProgram";
import type { Provider } from "../../types/provider";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getGrantProgramsByStudentId } from "../../services/GrantProgramService";
import { getProviderById } from "../../services/ProviderService";
import { createApplicationByStudentAndGrantProgramId } from "../../services/ApplicationService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import GrantListTable from "../../components/basicComponents/GrantListTable";

interface GrantListProps {}

const GrantList: React.FC<GrantListProps> = () => {
  const { student } = useOutletContext<{
    student: Student;
    setStudent: (s: Student) => void;
    updateStudent: (s: Student) => Promise<Student>;
  }>();
  const [grantPrograms, setGrantPrograms] = useState<GrantProgram[]>([]);
  const [providers, setProviders] = useState<Record<string, Provider>>({});
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 0, number: 0 });
  const [sortState, setSortState] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrants = async () => {
      if (!student?.id) return;
      const data = await getGrantProgramsByStudentId(student.id, 0, 10);
      setGrantPrograms(data.content);
      setPageInfo({
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        number: data.number,
      });
      // Fetch provider info for each grant
      const providerIds = Array.from(new Set(data.content.map(g => g.providerId)));
      const providerMap: Record<string, Provider> = {};
      await Promise.all(providerIds.map(async (id) => {
        try {
          const res = await getProviderById(id);
          if (res.data) {
            providerMap[id] = res.data;
          }
        } catch {}
      }));
      setProviders(providerMap);
    };
    fetchGrants();
  }, [student?.id]);

  const handleApply = async (grantId: string) => {
    if (!student?.id) return;
    try {
      await createApplicationByStudentAndGrantProgramId(student.id, grantId);
      alert("Application created successfully!");
    } catch (err) {
      alert("Failed to create application.");
    }
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
        // Special handling for provider organisation name
        if (key === 'organisation') {
          aValue = providers[a.providerId]?.organisationName || '';
          bValue = providers[b.providerId]?.organisationName || '';
        }
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

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Available Grants"
        headline="apply to the ones you are eligible"
        student={true}
      />
      {grantPrograms.length === 0 ? (
        <p>No grants to display.</p>
      ) : (
        <GrantListTable
          grants={grantPrograms}
          providers={providers}
          onApply={handleApply}
          getNextSchedule={getNextSchedule}
          onSort={handleSort}
          headers={[
            { label: "Grant Name", key: "title" },
            { label: "Organisation", key: "organisation" },
            { label: "Eligibility", key: "status" },
            { label: "Expected next schedule", key: "schedule" },
            { label: "Grant Amount / Receivers", key: "amount" },
          ]}
        />
      )}
    </div>
  );
};

export default GrantList;