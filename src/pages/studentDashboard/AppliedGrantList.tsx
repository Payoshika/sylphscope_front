import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getGrantProgramAndApplicationByStudentId } from "../../services/ApplicationService";
import type { GrantProgramApplicationDto } from "../../types/application";
import type { Student } from "../../types/student";
import type { Provider } from "../../types/provider";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import GrantListTable from "../../components/basicComponents/GrantListTable";

const AppliedGrantList: React.FC = () => {
  const { student } = useOutletContext<{ student: Student }>();
  const [appliedGrants, setAppliedGrants] = useState<GrantProgramApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortState, setSortState] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedGrants = async () => {
      if (!student?.id) return;
      try {
        const data = await getGrantProgramAndApplicationByStudentId(student.id);
        setAppliedGrants(data);
      } catch (err) {
        setAppliedGrants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedGrants();
  }, [student?.id]);

  // Map to GrantListTable expected props
  const grants = appliedGrants.map((item) => ({
    ...item.grantProgram,
    status: item.application.status,
    application: item.application,
  }));
  const providers: Record<string, Provider> = {};
  appliedGrants.forEach((item) => {
    providers[item.grantProgram.providerId] = {
      id: item.grantProgram.providerId,
      organisationName: item.grantProgram.providerId,
      contactEmail: "",
      contactPhone: "",
      websiteUrl: "",
      organisationDescription: "",
      logoUrl: "",
      createdAt: ""
    };
  });

  const getNextSchedule = (grant: any) => {
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

  const handleViewDetail = (grantId: string) => {
    navigate(`/student-application/${grantId}`);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortState({ key, direction });
    setAppliedGrants(prev => {
      const sorted = [...prev].sort((a, b) => {
        let aValue: any = a.grantProgram[key as keyof typeof a.grantProgram];
        let bValue: any = b.grantProgram[key as keyof typeof b.grantProgram];
        // Special handling for provider organisation name
        if (key === 'organisation') {
          aValue = providers[a.grantProgram.providerId]?.organisationName || '';
          bValue = providers[b.grantProgram.providerId]?.organisationName || '';
        }
        // Special handling for schedule
        if (key === 'schedule') {
          aValue = getNextSchedule(a.grantProgram);
          bValue = getNextSchedule(b.grantProgram);
        }
        // Special handling for amount
        if (key === 'amount') {
          aValue = a.grantProgram.award && a.grantProgram.award.length > 0 ? a.grantProgram.award[0] : 0;
          bValue = b.grantProgram.award && b.grantProgram.award.length > 0 ? b.grantProgram.award[0] : 0;
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
        title="Applied Grants"
        headline="list of grant you have applied"
        student={true}
      />
      {loading ? (
        <p>Loading applied grants...</p>
      ) : grants.length === 0 ? (
        <p>No applied grants to display.</p>
      ) : (
        <GrantListTable
          grants={grants}
          providers={providers}
          getNextSchedule={getNextSchedule}
          onViewDetail={handleViewDetail}
          onSort={handleSort}
        />
      )}
    </div>
  );
};
export default AppliedGrantList;