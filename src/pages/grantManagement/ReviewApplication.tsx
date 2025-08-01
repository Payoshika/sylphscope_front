import React, { useEffect, useState } from "react";
import type { Provider } from "../../types/provider";
import type { ApplicationDto, GrantProgramApplicationDto } from "../../types/application";
import { useNavigate, useOutletContext } from "react-router-dom";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import ApplicationListTable from "../../components/basicComponents/ApplicationListTable";

interface ReviewApplicationProps {
  provider: Provider;
}

// Mock data structure for applications
const mockApplications: GrantProgramApplicationDto[] = [
  {
    grantProgram: {
      id: "1",
      title: "Engineering Scholarship 2023",
      providerId: "provider1",
      status: "active",
      description: "",
      award: ["£5000"],
      numOfAward: 5,
      schedule: {
        applicationStartDate: "2024-01-01",
        applicationEndDate: "2024-06-30",
        decisionDate: "2024-07-30",
        fundDisbursementDate: "2024-09-01"
      }
    },
    application: {
      id: "app1",
      studentId: "student1",
      grantProgramId: "1",
      status: "applied",
      submittedAt: "2024-03-15T10:00:00Z",
      updatedAt: "2024-03-15T10:00:00Z",
      eligibilityResult: {
        id: "elig1",
        studentId: "student1",
        applicationId: "app1",
        grantProgramId: "1",
        isEligible: true,
        evaluatedAt: "2024-03-15T10:00:00Z",
        updatedAt: "2024-03-15T10:00:00Z",
        failedCriteria: [],
        passedCriteria: ["age", "nationality", "education"]
      },
      studentAnswers: {}
    }
  },
  // Add more mock applications as needed
];

const ReviewApplication: React.FC<ReviewApplicationProps> = ({ provider }) => {
  const [applications, setApplications] = useState<GrantProgramApplicationDto[]>(mockApplications);
  const [loading, setLoading] = useState(false);
  const [sortState, setSortState] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In real implementation, fetch applications here
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 500);
  }, [provider.id]);

  const handleViewApplication = (applicationId: string) => {
    navigate(`/grant-management/review/${applicationId}`);
  };

  const getApplicationStatus = (application: ApplicationDto) => {
    return application.status.charAt(0).toUpperCase() + application.status.slice(1);
  };

  const getEligibilityStatus = (application: ApplicationDto) => {
    return application.eligibilityResult.isEligible ? "Eligible" : "Not Eligible";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortState({ key, direction });
    setApplications(prev => {
      const sorted = [...prev].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (key) {
          case "grantName":
            aValue = a.grantProgram.title;
            bValue = b.grantProgram.title;
            break;
          case "submittedDate":
            aValue = new Date(a.application.submittedAt).getTime();
            bValue = new Date(b.application.submittedAt).getTime();
            break;
          case "status":
            aValue = a.application.status;
            bValue = b.application.status;
            break;
          case "eligibility":
            aValue = a.application.eligibilityResult.isEligible;
            bValue = b.application.eligibilityResult.isEligible;
            break;
          default:
            aValue = a.application[key as keyof ApplicationDto];
            bValue = b.application[key as keyof ApplicationDto];
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return direction === 'asc' ? (aValue ? 1 : -1) : (aValue ? -1 : 1);
        }
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
      return sorted;
    });
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Review Applications"
        headline="Review and manage grant applications"
        provider={true}
      />
      {applications.length === 0 ? (
        <p>No applications to review.</p>
      ) : (
        <ApplicationListTable
          applications={applications}
          provider={provider}
          onViewDetail={handleViewApplication}
          onSort={handleSort}
          headers={[
            { label: "Grant Name", key: "grantName" },
            { label: "Submitted Date", key: "submittedDate" },
            { label: "Application Status", key: "status" },
            { label: "Eligibility", key: "eligibility" },
            { label: "Actions", key: "actions" },
          ]}
        />
      )}
    </div>
  );
};

export default ReviewApplication; 