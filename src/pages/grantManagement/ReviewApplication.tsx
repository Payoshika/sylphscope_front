import React, { useEffect, useState } from "react";
import type { Provider } from "../../types/provider";
import type { ApplicationDto, GrantProgramApplicationDto, EvaluationOfAnswerDto } from "../../types/application";
import type { GrantProgram } from "../../types/grantProgram";
import type { Student } from "../../types/student";
import { useNavigate } from "react-router-dom";
import { getApplicationsByGrantProgramId, getEvaluationsByGrantProgramId, addReceiver, rejectReceiver } from "../../services/ApplicationService";
import { getStudentById } from "../../services/StudentService";
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
  const [evaluations, setEvaluations] = useState<Record<string, Record<string, EvaluationOfAnswerDto[]>>>({});
  const [students, setStudents] = useState<Record<string, Student>>({});
  const [loadingStudents, setLoadingStudents] = useState(false);
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
      console.log("fetchedApplications");
      console.log(fetchedApplications);
      setApplications(fetchedApplications);

      // Fetch student details for all applications
      await fetchStudentDetails(fetchedApplications);

      // Fetch evaluations for this grant program
      try {
        const fetchedEvaluations = await getEvaluationsByGrantProgramId(grantProgramId);
        console.log("fetchedEvaluations");
        console.log(fetchedEvaluations);
        
        // Organize evaluations into the map structure: {applicationId: {questionId: [evaluations]}}
        const evaluationsMap: Record<string, Record<string, EvaluationOfAnswerDto[]>> = {};
        
        fetchedEvaluations.forEach(evaluation => {
          const applicationId = evaluation.applicationId;
          const questionKey = evaluation.questionGroupId || evaluation.questionId;
          
          if (!evaluationsMap[applicationId]) {
            evaluationsMap[applicationId] = {};
          }
          
          if (!evaluationsMap[applicationId][questionKey]) {
            evaluationsMap[applicationId][questionKey] = [];
          }
          
          evaluationsMap[applicationId][questionKey].push(evaluation);
        });
        
        console.log("Organized evaluations map:", evaluationsMap);
        setEvaluations(evaluationsMap);
      } catch (error) {
        console.error('Failed to fetch evaluations:', error);
        setEvaluations({});
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (applications: ApplicationDto[]) => {
    try {
      setLoadingStudents(true);
      const studentsMap: Record<string, Student> = {};
      
      // Fetch student details for each application
      const studentPromises = applications.map(async (application) => {
        try {
          const student = await getStudentById(application.studentId);
          studentsMap[application.studentId] = student;
        } catch (error) {
          console.error(`Failed to fetch student details for studentId: ${application.studentId}`, error);
          // Continue with other students even if one fails
        }
      });
      
      await Promise.all(studentPromises);
      setStudents(studentsMap);
    } catch (error) {
      console.error('Failed to fetch student details:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleGrantProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGrantProgramId(e.target.value);
  };

  const handleViewApplication = (applicationId: string) => {
    navigate(`/grant-management/review-student-answer/${applicationId}`);
  };

  const handleSelect = async (applicationId: string) => {
    try {
      await addReceiver(applicationId);
      alert("Applicant selected successfully!");
      // Refresh the applications list to show updated status
      if (selectedGrantProgramId) {
        await fetchApplications(selectedGrantProgramId);
      }
    } catch (error) {
      console.error("Failed to select applicant:", error);
      alert("Failed to select applicant");
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await rejectReceiver(applicationId);
      alert("Applicant rejected successfully!");
      // Refresh the applications list to show updated status
      if (selectedGrantProgramId) {
        await fetchApplications(selectedGrantProgramId);
      }
    } catch (error) {
      console.error("Failed to reject applicant:", error);
      alert("Failed to reject applicant");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get evaluations for a specific application and question
  const getEvaluationsForApplicationAndQuestion = (applicationId: string, questionId: string): EvaluationOfAnswerDto[] => {
    const applicationEvaluations = evaluations[applicationId];
    if (!applicationEvaluations) {
      return [];
    }
    
    // Check for questionId first, then questionGroupId
    const questionEvaluations = applicationEvaluations[questionId] || [];
    return questionEvaluations;
  };

  // Helper function to calculate marking score for an application
  const calculateMarkingScore = (applicationId: string, grantProgram: GrantProgram): number => {
    if (!grantProgram.selectionCriteria || grantProgram.selectionCriteria.length === 0) {
      return 0;
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;
    let criteriaWithEvaluations = 0;

    console.log(`Calculating marking score for application ${applicationId}:`);

    grantProgram.selectionCriteria.forEach(criterion => {
      const questionKey = criterion.questionId || criterion.id;
      if (!questionKey) return;

      const questionEvaluations = getEvaluationsForApplicationAndQuestion(applicationId, questionKey);
      
      if (questionEvaluations.length === 0) {
        console.log(`  Criterion ${criterion.criterionName}: No evaluations found`);
        return; // Skip criteria with no evaluations
      }

      // Calculate average score for this question (multiple evaluators)
      const averageScore = questionEvaluations.reduce((sum, evaluation) => sum + evaluation.value, 0) / questionEvaluations.length;
      
      // Apply weight to the average score
      const weightedScore = averageScore * criterion.weight/100;
      totalWeightedScore += weightedScore;
      totalWeight += criterion.weight;
      criteriaWithEvaluations++;

      console.log(`  Criterion ${criterion.criterionName}:`);
      console.log(`    Question Key: ${questionKey}`);
      console.log(`    Evaluations: ${questionEvaluations.length}`);
      console.log(`    Average Score: ${averageScore.toFixed(2)}`);
      console.log(`    Weight: ${criterion.weight}`);
      console.log(`    Weighted Score: ${weightedScore.toFixed(2)}`);
    });

    const finalScore = criteriaWithEvaluations > 0 ? totalWeightedScore: 0;
    console.log(`  Final Score: ${finalScore.toFixed(2)} (Total Weighted: ${totalWeightedScore.toFixed(2)}, Total Weight: ${totalWeight})`);
    
    return finalScore;
  };

  // Helper function to get applicant name (placeholder - you may need to fetch student details)
  const getApplicantName = (applicationId: string): string => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return "Unknown Student";
    
    const student = students[application.studentId];
    if (!student) return `Student ${application.studentId}`;
    
    const firstName = student.firstName || '';
    const lastName = student.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    return fullName || `Student ${application.studentId}`;
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setApplications(prev => {
      const sorted = [...prev].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (key) {
          case "applicantName":
            aValue = getApplicantName(a.id);
            bValue = getApplicantName(b.id);
            break;
          case "appliedDate":
            aValue = new Date(a.submittedAt).getTime();
            bValue = new Date(b.submittedAt).getTime();
            break;
          case "markingScore":
            const selectedGrant = grantPrograms.find(g => g.id === selectedGrantProgramId);
            aValue = selectedGrant ? calculateMarkingScore(a.id, selectedGrant) : 0;
            bValue = selectedGrant ? calculateMarkingScore(b.id, selectedGrant) : 0;
            break;
          case "eligibility":
            aValue = a.eligibilityResult?.eligible || false;
            bValue = b.eligibilityResult?.eligible || false;
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

  // Calculate marking scores for all applications
  const markingScores: Record<string, number> = {};
  const applicantNames: Record<string, string> = {};
  const appliedDates: Record<string, string> = {};
  
  applications.forEach(application => {
    const selectedGrant = grantPrograms.find(g => g.id === selectedGrantProgramId);
    if (selectedGrant) {
      markingScores[application.id] = calculateMarkingScore(application.id, selectedGrant);
      applicantNames[application.id] = getApplicantName(application.id);
      appliedDates[application.id] = formatDate(application.updatedAt);
    }
  });

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Review Applications"
        headline="Review and manage grant applications"
        provider={true}
      />
      
      <div className="grant-program-select">
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

      {loading || loadingStudents ? (
        <div>Loading applications and student details...</div>
      ) : selectedGrantProgramId && applicationsForTable.length === 0 ? (
        <p>No applications found for the selected grant program.</p>
      ) : selectedGrantProgramId ? (
        <ApplicationListTable
          applications={applicationsForTable}
          provider={provider}
          onViewDetail={handleViewApplication}
          onSort={handleSort}
          markingScores={markingScores}
          applicantNames={applicantNames}
          appliedDates={appliedDates}
          onSelect={handleSelect}
          onReject={handleReject}
          headers={[
            { label: "Applicant Name", key: "applicantName" },
            { label: "Applied Date", key: "appliedDate" },
            { label: "Eligibility", key: "eligibility" },
            { label: "Marking Score", key: "markingScore" },
            { label: "Status", key: "status" },
          ]}
        />
      ) : (
        <p>Please select a grant program to view applications.</p>
      )}
    </div>
  );
};

export default ReviewApplication; 