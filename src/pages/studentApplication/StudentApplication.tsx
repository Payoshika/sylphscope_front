import { useEffect, useState} from "react";
import StudentApplicationNav from "./StudentApplicationNav";
import GrantOverview from "./GrantOverview";
import OrganisationInfo from "./OrganisationInfo";
import Eligibility from "./Eligibility";
import Apply from "./Apply";
import { useOutletContext, Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import type { Student } from "../../types/student";
import { getGrantProgramAndApplicationByStudentIdandGrantProgramId, getEligibilityCriteriaAndQuestionFromGrantProgramId, getAnswersByApplicationId, updateAnswers, createEmptyApplication, getLatestAnswersByStudentId } from "../../services/ApplicationService";
import type { ApplicationDto, GrantProgramApplicationDto, EligibilityCriteriaWithQuestionDto } from "../../types/application";
import type { GrantProgram } from "../../types/grantProgram";
import { getQuestionByGrantProgramId } from "../../services/GrantProgramService";
import type { QuestionEligibilityInfoDto, QuestionGroupEligibilityInfoDto } from "../../data/questionEligibilityInfoDto";
import Questions from "./Questions";
import type { Answer, StudentAnswerDto } from "../../types/application";

const steps = [
  {key: "organisation", label: "Organisation Info"},
  { key: "overview", label: "Grant Overview" },
  { key: "eligibility", label: "Eligibility Criteria" },
  { key: "questions", label: "Questions" },
  { key: "apply", label: "Submit Application" },
];

const getInputTypeForQuestion = (questionId: string, questions: QuestionEligibilityInfoDto[], questionGroups: QuestionGroupEligibilityInfoDto[]) => {
  // Check in questions
  const q = questions.find(q => q.question.id === questionId);
  if (q) return q.question.inputType;
  // Check in question groups
  for (const group of questionGroups) {
    const qg = group.questions.find(q => q.question.id === questionId);
    if (qg) return qg.question.inputType;
  }
  return undefined;
};

const StudentApplication = () => {
  const { student } = useOutletContext<{ student: Student }>();
  const { grantProgramId } = useParams<{ grantProgramId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [grantProgram, setGrantProgram] = useState<GrantProgram | null>(null);
  const [application, setApplication] = useState<ApplicationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityCriteriaWithQuestion, setEligibilityCriteriaWithQuestion] = useState<EligibilityCriteriaWithQuestionDto[]>([]);
  const [questions, setQuestions] = useState<QuestionEligibilityInfoDto[]>([]);
  const [questionGroups, setQuestionGroups] = useState<QuestionGroupEligibilityInfoDto[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Handler for answer changes
  const handleAnswerChange = (
    id: string,
    value: any,
    questionGroupId?: string
  ) => {
    console.log("handleAnswerChange", id, value, questionGroupId);
    if (questionGroupId) {
      setAnswers((prev) => ({
        ...prev,
        [questionGroupId]: {
          ...(prev[questionGroupId] || {}),
          [id]: value,
        },
      }));
    } else {
      setAnswers((prev) => ({ ...prev, [id]: value }));
    }
    console.log("answers", answers);
  };

  const handleStepChange = (stepKey: string) => {
    navigate(`/student-application/${grantProgramId}/${stepKey}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    let currentApplication = application;

    // If application is null, create an empty application first
    if (!currentApplication) {
      try {
        const emptyApplicationDto: ApplicationDto = {
          id: "",
          studentId: student?.id ?? "",
          grantProgramId: grantProgramId ?? "",
          status: "draft",
          submittedAt: "",
          updatedAt: "",
          eligibilityResult: {
            id: "",
            studentId: student?.id ?? "",
            applicationId: "",
            grantProgramId: grantProgramId ?? "",
            eligible: false,
            evaluatedAt: "",
            updatedAt: "",
            failedCriteria: [],
            passedCriteria: [],
          },
          studentAnswers: {},
        };
        currentApplication = await createEmptyApplication(emptyApplicationDto);
        setApplication(currentApplication);
      } catch (err) {
        setSubmitError("Failed to create application.");
        setIsSubmitting(false);
        return;
      }
    }

    const answerDtos: StudentAnswerDto[] = [];
    try {
      Object.entries(answers).forEach(([key, value]) => {
        console.log("key", key, "value", value);
        if (typeof value === "object" && !Array.isArray(value) && value.year == null) {
          const groupAnswers: Answer[] = Object.entries(value).map(([questionId, answerValue]) => ({
            questionId,
            answer: [answerValue],
          }));
          answerDtos.push({
            id: key,
            studentId: student?.id ?? "",
            questionId: "",
            applicationId: [currentApplication?.id ?? ""],
            questionGroupId: key,
            answer: groupAnswers,
            questionText: "",
            optionText: "",
          });
        } else {
          // single question
          answerDtos.push({
            id: key,
            studentId: student?.id ?? "",
            questionId: key,
            applicationId: [currentApplication?.id ?? ""],
            questionGroupId: "",
            answer: [{
              questionId: key,
              answer: [value],
            }],
            questionText: "",
            optionText: "",
          });
        }
      });
      console.log("answerDtos", answerDtos);
      await updateAnswers(student?.id ?? "", grantProgramId ?? "", answerDtos);
      setSubmitSuccess("Answers submitted successfully.");
    } catch (err: any) {
      setSubmitError("Failed to submit answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchGrantProgramApplication = async () => {
      if (!student?.id || !grantProgramId) return;
      try {
        const data: GrantProgramApplicationDto = await getGrantProgramAndApplicationByStudentIdandGrantProgramId(
          student.id,
          grantProgramId
        );
        setGrantProgram(data.grantProgram);
        setApplication(data.application);
        // Fetch eligibility criteria and questions
        const criteriaWithQuestionList = await getEligibilityCriteriaAndQuestionFromGrantProgramId(grantProgramId);
        setEligibilityCriteriaWithQuestion(criteriaWithQuestionList);

        // Fetch answers
        let initialAnswers: Record<string, any> = {};
        if (data.application?.id) {
          const backendAnswers = await getAnswersByApplicationId(student.id, data.application.id);
          console.log("backendAnswers with application id if exist", backendAnswers);
          // Convert StudentAnswerDto[] to answers object
            backendAnswers.forEach((dto) => {
              if (dto.questionGroupId) {
                if (!initialAnswers[dto.questionGroupId]) initialAnswers[dto.questionGroupId] = {};
                dto.answer.forEach(ans => {
                  const inputType = getInputTypeForQuestion(ans.questionId, questions, questionGroups);
                  if (inputType === "MULTISELECT") {
                    let arr = Array.isArray(ans.answer) ? ans.answer : ans.answer ? [ans.answer] : [];
                    if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null && 'value' in arr[0]) {
                      arr = arr.map((v: any) => v.value);
                    }
                    if (!Array.isArray(arr) && typeof arr === 'object' && arr !== null) {
                      arr = Object.values(arr);
                    }
                    initialAnswers[dto.questionGroupId][ans.questionId] = arr;
                  } else {
                    initialAnswers[dto.questionGroupId][ans.questionId] = Array.isArray(ans.answer) && ans.answer.length === 1 ? ans.answer[0] : ans.answer;
                  }
                });
              } else {
                // Single question
                if (dto.answer && dto.answer.length > 0) {
                  const inputType = getInputTypeForQuestion(dto.questionId, questions, questionGroups);
                  if (inputType === "MULTISELECT") {
                    let arr = Array.isArray(dto.answer[0].answer) ? dto.answer[0].answer : dto.answer[0].answer ? [dto.answer[0].answer] : [];
                    if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null && 'value' in arr[0]) {
                      arr = arr.map((v: any) => v.value);
                    }
                    if (!Array.isArray(arr) && typeof arr === 'object' && arr !== null) {
                      arr = Object.values(arr);
                    }
                    initialAnswers[dto.questionId] = arr;
                  } else {
                    initialAnswers[dto.questionId] = Array.isArray(dto.answer[0].answer) && dto.answer[0].answer.length === 1
                      ? dto.answer[0].answer[0]
                      : dto.answer[0].answer;
                  }
                }
              }
            });
          setAnswers(prev => ({
            ...prev,
            ...initialAnswers
          }));
          console.log("initialAnswers", initialAnswers);
        }
        else{
            // If no answers for this application, fetch latest answers by studentId
            const latestAnswers = await getLatestAnswersByStudentId(student.id);
            latestAnswers.forEach((dto: StudentAnswerDto) => {
              if (dto.questionGroupId) {
                if (!initialAnswers[dto.questionGroupId]) initialAnswers[dto.questionGroupId] = {};
                dto.answer.forEach((ans: Answer) => {
                  const inputType = getInputTypeForQuestion(ans.questionId, questions, questionGroups);
                  if (inputType === "MULTISELECT") {
                    let arr = Array.isArray(ans.answer) ? ans.answer : ans.answer ? [ans.answer] : [];
                    if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null && 'value' in arr[0]) {
                      arr = arr.map((v: any) => v.value);
                    }
                    if (!Array.isArray(arr) && typeof arr === 'object' && arr !== null) {
                      arr = Object.values(arr);
                    }
                    initialAnswers[dto.questionGroupId][ans.questionId] = arr;
                  } else {
                    initialAnswers[dto.questionGroupId][ans.questionId] = Array.isArray(ans.answer) && ans.answer.length === 1 ? ans.answer[0] : ans.answer;
                  }
                });
              } else {
                // Single question
                if (dto.answer && dto.answer.length > 0) {
                  const inputType = getInputTypeForQuestion(dto.questionId, questions, questionGroups);
                  if (inputType === "MULTISELECT") {
                    let arr = Array.isArray(dto.answer[0].answer) ? dto.answer[0].answer : dto.answer[0].answer ? [dto.answer[0].answer] : [];
                    if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null && 'value' in arr[0]) {
                      arr = arr.map((v: any) => v.value);
                    }
                    if (!Array.isArray(arr) && typeof arr === 'object' && arr !== null) {
                      arr = Object.values(arr);
                    }
                    initialAnswers[dto.questionId] = arr;
                  } else {
                    initialAnswers[dto.questionId] = Array.isArray(dto.answer[0].answer) && dto.answer[0].answer.length === 1
                      ? dto.answer[0].answer[0]
                      : dto.answer[0].answer;
                  }
                }
              }
            });
          console.log("initialAnswers without application", initialAnswers);
          setAnswers(prev => ({
            ...prev,
            ...initialAnswers
          }));
        }
        console.log("student application rendered");
      } catch (err) {
        setGrantProgram(null);
        setApplication(null);
        setEligibilityCriteriaWithQuestion([]);
        setAnswers({});
      } finally {
        setLoading(false);
      }
    };
    fetchGrantProgramApplication();
  }, []);

  useEffect(() => {
    const fetchQuestionsAndGroups = async () => {
      if (!grantProgramId) return;
      try {
        const { questions, questionGroups } = await getQuestionByGrantProgramId(grantProgramId);
        setQuestions(questions);
        setQuestionGroups(questionGroups);
      } catch (err) {
        setQuestions([]);
        setQuestionGroups([]);
      }
    };
    fetchQuestionsAndGroups();
  }, [grantProgramId]);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grant-create-layout">
      <StudentApplicationNav
        steps={steps}
        currentStep={location.pathname.split("/").pop() || steps[0].key}
        onStepChange={handleStepChange}
      />
      <main className="grant-create-content">
        <Routes>
          <Route path="/" element={<Navigate to="overview" replace />} />
            <Route
                path="overview"
                element={<GrantOverview grantProgram={grantProgram} />}
            />
            <Route
            path="organisation"
                element={<OrganisationInfo grantProgram={grantProgram}  />}
            />     
          <Route
            path="eligibility"
            element={
              <Eligibility
                eligibilityCriteriaWithQuestion={eligibilityCriteriaWithQuestion}
                application={application}
                answers={answers}
                handleAnswerChange={handleAnswerChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
                submitSuccess={submitSuccess}
                studentId={student?.id ?? ""}
                grantProgramId={grantProgramId ?? ""}
                setAnswers={setAnswers}
              />
            }
          />   
          <Route
            path="questions"
            element={
              <Questions
                questions={questions}
                questionGroups={questionGroups}
                application={application}
                answers={answers}
                setAnswers={setAnswers}
                handleAnswerChange={handleAnswerChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
                submitSuccess={submitSuccess}
              />
            }
          />
          <Route
            path="apply"
            element={
              application ? (
                <Apply
                  application={application}
                  grantProgramId={grantProgramId ?? ""}
                />
              ) : (
                <div>Loading application...</div>
              )
            }
          />
    </Routes>
      </main>
    </div>
  );
};

export default StudentApplication;