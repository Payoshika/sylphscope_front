import React, { useEffect, useState } from "react";
import type { Provider } from "../../types/provider";
import type { ApplicationDto, GrantProgramApplicationDto } from "../../types/application";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getApplicationsByGrantProgramId } from "../../services/ApplicationService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import ApplicationListTable from "../../components/basicComponents/ApplicationListTable";
import Select from "../../components/inputComponents/Select";
import type { SelectOption } from "../../components/inputComponents/Select";

interface ReviewApplicationProps {
  provider: Provider;
  grantPrograms?: GrantProgram[];
}

const ReviewApplication: React.FC<ReviewApplicationProps> = ({ provider, grantPrograms = [] }) => {
  const [selectedGrantProgramId, setSelectedGrantProgramId] = useState<string>("");
  const [applications, setApplications] = useState<ApplicationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Convert grant programs to select options
  const grantProgramOptions: SelectOption[] = grantPrograms.map(grant => ({
    value: grant.id,
    label: grant.title
  }));

  useEffect(() => {
    if (selectedGrantProgramId) {
      fetchApplications(selectedGrantProgramId);
    } else {
      setApplications([]);
    }
  }, [selectedGrantProgramId]);

  const fetchApplications = async (grantProgramId: string) => {
    try {
      setLoading(true);
      const fetchedApplications = await getApplicationsByGrantProgramId(grantProgramId);
      setApplications(fetchedApplications);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrantProgramId(e.target.value);
  };

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
    setApplications(prev => {
      const sorted = [...prev].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (key) {
          case "studentId":
            aValue = a.studentId;
            bValue = b.studentId;
            break;
          case "submittedDate":
            aValue = new Date(a.submittedAt).getTime();
            bValue = new Date(b.submittedAt).getTime();
            break;
          case "status":
            aValue = a.status;
            bValue = b.status;
            break;
          case "eligibility":
            aValue = a.eligibilityResult.isEligible;
            bValue = b.eligibilityResult.isEligible;
            break;
          default:
            aValue = a[key as keyof ApplicationDto];
            bValue = b[key as keyof ApplicationDto];
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

  // Convert applications to GrantProgramApplicationDto format for the table
  const applicationsForTable: GrantProgramApplicationDto[] = applications.map(application => {
    const selectedGrant = grantPrograms.find(g => g.id === selectedGrantProgramId);
    return {
      grantProgram: selectedGrant || {
        id: selectedGrantProgramId,
        title: "Unknown Grant",
        description: "",
        providerId: provider.id,
        providerName: provider.organisationName,
        status: "DRAFT",
        schedule: {
          applicationStartDate: null,
          applicationEndDate: null,
          decisionDate: null,
          fundDisbursementDate: null
        },
        createdAt: "",
        updatedAt: "",
        assignedStaffIds: [],
        contactPerson: {
          id: "",
          userId: "",
          providerId: provider.id,
          firstName: "",
          lastName: "",
          role: "MANAGER"
        },
        questionIds: [],
        questionGroupsIds: [],
        selectionCriteria: [],
        evaluationScale: "HUNDRED"
      },
      application
    };
  });

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Review Applications"
        headline="Review and manage grant applications"
        provider={true}
      />
      
      <div style={{ marginBottom: '2rem' }}>
        <Select
          id="grant-program-select"
          name="grantProgram"
          label="Select Grant Program"
          value={selectedGrantProgramId}
          onChange={handleGrantProgramChange}
          options={grantProgramOptions}
          placeholder="Choose a grant program..."
          required
        />
      </div>

      {loading ? (
        <div>Loading applications...</div>
      ) : selectedGrantProgramId && applicationsForTable.length === 0 ? (
        <p>No applications found for the selected grant program.</p>
      ) : selectedGrantProgramId ? (
        <ApplicationListTable
          applications={applicationsForTable}
          provider={provider}
          onViewDetail={handleViewApplication}
          onSort={handleSort}
          headers={[
            { label: "Student ID", key: "studentId" },
            { label: "Submitted Date", key: "submittedDate" },
            { label: "Application Status", key: "status" },
            { label: "Eligibility", key: "eligibility" },
            { label: "Actions", key: "actions" },
          ]}
        />
      ) : (
        <p>Please select a grant program to view applications.</p>
      )}
    </div>
  );
};

export default ReviewApplication; 