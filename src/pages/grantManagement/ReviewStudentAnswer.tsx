import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import type { ApplicationDto } from "../../types/application";
import type { EligibilityCriteriaWithQuestionDto, EvaluationOfAnswerDto } from "../../types/application";
import type { GrantProgram, SelectionCriterion, EvaluationScale } from "../../types/grantProgram";
import { getApplicationById } from "../../services/ApplicationService";
import { getEligibilityCriteriaAndQuestionFromGrantProgramId } from "../../services/ApplicationService";
import { getQuestionByGrantProgramId, getGrantProgramById } from "../../services/GrantProgramService";
import { getAnswersByApplicationId, getEvaluationOfAnswerDtoForApplicationAndEvaluatorId, updateEvaluations, getEvaluationsByApplicationId } from "../../services/ApplicationService";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import { renderInput } from "../../utility/QuestionInput";
import Button from "../../components/basicComponents/Button";
import NumberInput from "../../components/inputComponents/NumberInput";
import Select from "../../components/inputComponents/Select";
import Textarea from "../../components/inputComponents/Textarea";
import type { ProviderStaff } from "../../types/user";
import { isManager, isEditor } from "../../utility/permissions";

const ReviewStudentAnswer: React.FC = () => {
  const { providerStaff } = useOutletContext<{ providerStaff: ProviderStaff; provider: any }>();
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState<ApplicationDto | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionGroups, setQuestionGroups] = useState<any[]>([]);
  const [eligibilityQuestions, setEligibilityQuestions] = useState<EligibilityCriteriaWithQuestionDto[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [grantProgram, setGrantProgram] = useState<GrantProgram | null>(null);
  const [selectionCriteria, setSelectionCriteria] = useState<SelectionCriterion[]>([]);
  const [selectionCriteriaAnswers, setSelectionCriteriaAnswers] = useState<Record<string, any>>({});
  const [selectionCriteriaComments, setSelectionCriteriaComments] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<EvaluationOfAnswerDto[]>([]);
  const [existingEvaluations, setExistingEvaluations] = useState<EvaluationOfAnswerDto[]>([]);
  const [otherStaffEvaluations, setOtherStaffEvaluations] = useState<EvaluationOfAnswerDto[]>([]);
  const [savingEvaluations, setSavingEvaluations] = useState(false);
  const [studentAnswerIdMapping, setStudentAnswerIdMapping] = useState<Record<string, string>>({});

  // Check if current staff can see other evaluations
  const canViewOtherEvaluations = isEditor(providerStaff); // Manager or Administrator

  useEffect(() => {
    if (applicationId) {
      fetchApplicationData();
    }
  }, [applicationId]);

  // Separate useEffect to handle evaluation mapping when selectionCriteria is available
  useEffect(() => {
    if (existingEvaluations.length > 0 && selectionCriteria.length > 0) {
      console.log("Mapping evaluations to UI with selection criteria:", selectionCriteria);
      
      const existingAnswersMap: Record<string, any> = {};
      const existingCommentsMap: Record<string, string> = {};
      
      existingEvaluations.forEach(evaluation => {
        // Find the criterion that corresponds to this evaluation
        const correspondingCriterion = selectionCriteria.find(c => 
          c.questionId === evaluation.questionId || c.id === evaluation.questionId
        );
        if (correspondingCriterion) {
          existingAnswersMap[correspondingCriterion.id || ""] = evaluation.value;
          existingCommentsMap[correspondingCriterion.id || ""] = evaluation.comment || "";
        }
      });
      
      setSelectionCriteriaAnswers(existingAnswersMap);
      setSelectionCriteriaComments(existingCommentsMap);
      console.log("Existing selection criteria answers:", existingAnswersMap);
      console.log("Existing selection criteria comments:", existingCommentsMap);
    }
  }, [existingEvaluations, selectionCriteria]);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);
      
      if (!applicationId) {
        throw new Error("Missing application ID");
      }
      
      // Fetch application details
      const currentApplication = await getApplicationById(applicationId);
      if (!currentApplication) {
        throw new Error("Application not found");
      }
      setApplication(currentApplication);

      // Fetch grant program details including selection criteria
      const grantProgramData = await getGrantProgramById(currentApplication.grantProgramId);
      setGrantProgram(grantProgramData);
      setSelectionCriteria(grantProgramData.selectionCriteria || []);

      // Fetch questions and question groups
      const questionsData = await getQuestionByGrantProgramId(currentApplication.grantProgramId);
      setQuestions(questionsData.questions);
      setQuestionGroups(questionsData.questionGroups);

      // Fetch eligibility questions
      const eligibilityData = await getEligibilityCriteriaAndQuestionFromGrantProgramId(currentApplication.grantProgramId);
      setEligibilityQuestions(eligibilityData);

      // Fetch student answers
      const studentAnswers = await getAnswersByApplicationId(currentApplication.studentId, applicationId);
      const answersMap: Record<string, any> = {};
      const studentAnswerIdMap: Record<string, string> = {};
      
      console.log("Student answers:", studentAnswers);
      
      studentAnswers.forEach(answerDto => {
        console.log("Processing answerDto:", answerDto);
        if (answerDto.questionGroupId) {
          if (!answersMap[answerDto.questionGroupId]) {
            answersMap[answerDto.questionGroupId] = {};
          }
          answerDto.answer.forEach((ans: any) => {
            console.log("Group answer:", ans);
            // Handle different answer formats
            let processedAnswer = ans.answer;
            if (Array.isArray(processedAnswer) && processedAnswer.length === 1) {
              processedAnswer = processedAnswer[0];
            }
            answersMap[answerDto.questionGroupId][ans.questionId] = processedAnswer;
            studentAnswerIdMap[ans.questionId] = answerDto.id;
          });
        } else {
          answerDto.answer.forEach((ans: any) => {
            console.log("Individual answer:", ans);
            // Handle different answer formats
            let processedAnswer = ans.answer;
            if (Array.isArray(processedAnswer) && processedAnswer.length === 1) {
              processedAnswer = processedAnswer[0];
            }
            answersMap[ans.questionId] = processedAnswer;
            studentAnswerIdMap[ans.questionId] = answerDto.id;
          });
        }
      });
      
      console.log("Processed answers map:", answersMap);
      setAnswers(answersMap);
      setStudentAnswerIdMapping(studentAnswerIdMap);

      // Fetch existing evaluations for this application and evaluator
      if (providerStaff?.id) {
        console.log("Fetching existing evaluations...for", providerStaff.id);
        try {
          const existingEvaluationsData = await getEvaluationOfAnswerDtoForApplicationAndEvaluatorId(
            applicationId,
            providerStaff.id
          );
          console.log("Existing evaluations fetched:", existingEvaluationsData);
          setEvaluations(existingEvaluationsData);
          setExistingEvaluations(existingEvaluationsData);

          // Fetch all evaluations for this application if user is admin or manager
          if (canViewOtherEvaluations) {
            try {
              const allEvaluationsData = await getEvaluationsByApplicationId(applicationId);
              // Filter out current staff's evaluations
              const otherStaffEvals = allEvaluationsData.filter(evaluation => evaluation.evaluatorId !== providerStaff.id);
              setOtherStaffEvaluations(otherStaffEvals);
              console.log("Other staff evaluations fetched:", otherStaffEvals);
            } catch (error) {
              console.error("Failed to fetch other staff evaluations:", error);
              setOtherStaffEvaluations([]);
            }
          }
        } catch (error) {
          console.error("Failed to fetch existing evaluations:", error);
          // Continue without existing evaluations
        }
      }
      else{
        console.log("No provider staff ID available");
      }

    } catch (error) {
      console.error('Failed to fetch application data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to find a question by ID
  const findQuestionById = (questionId: string) => {
    return questions.find(q => q.question.id === questionId);
  };

  // Helper function to find a question group by ID
  const findQuestionGroupById = (groupId: string) => {
    return questionGroups.find(g => g.id === groupId);
  };

  // Helper function to get options for evaluation scale
  const getEvaluationScaleOptions = (scale: EvaluationScale) => {
    switch (scale) {
      case "HUNDRED":
        return Array.from({ length: 101 }, (_, i) => ({ value: i.toString(), label: i.toString() }));
      case "TEN":
        return Array.from({ length: 11 }, (_, i) => ({ value: i.toString(), label: i.toString() }));
      case "FIVE":
        return Array.from({ length: 6 }, (_, i) => ({ value: i.toString(), label: i.toString() }));
      case "A2E":
        return [
          { value: "A", label: "A" },
          { value: "B", label: "B" },
          { value: "C", label: "C" },
          { value: "D", label: "D" },
          { value: "E", label: "E" }
        ];
      default:
        return [];
    }
  };

  // Helper function to handle selection criteria answer changes
  const handleSelectionCriteriaChange = (criterionId: string, value: any) => {
    setSelectionCriteriaAnswers(prev => ({
      ...prev,
      [criterionId]: value
    }));
  };

  // Helper function to handle selection criteria comment changes
  const handleSelectionCriteriaCommentChange = (criterionId: string, comment: string) => {
    setSelectionCriteriaComments(prev => ({
      ...prev,
      [criterionId]: comment
    }));
  };

  // Function to save selection criteria evaluations
  const handleSaveSelectionCriteria = async () => {
    try {
      setSavingEvaluations(true);
      
      if (!applicationId || !providerStaff?.id) {
        throw new Error("Missing application ID or provider staff ID");
      }

      const evaluationsToSave: EvaluationOfAnswerDto[] = Object.entries(selectionCriteriaAnswers).map(([criterionId, value]) => {
        const criterion = selectionCriteria.find(c => c.id === criterionId);
        const existingEvaluation = evaluations.find(e => e.questionId === criterion?.questionId);
        
        // Get the actual questionId from the criterion
        const actualQuestionId = criterion?.questionId || criterionId;
        console.log("Actual question ID:", actualQuestionId);
        console.log("Student answer ID mapping:", studentAnswerIdMapping);
        const studentAnswerId = studentAnswerIdMapping[actualQuestionId] || "";
        
        return {
          id: existingEvaluation?.id || "",
          studentAnswerId: studentAnswerId,
          applicationId: applicationId,
          grantProgramId: application?.grantProgramId || "",
          evaluatorId: providerStaff.id,
          questionId: actualQuestionId,
          questionGroupId: "", // SelectionCriterion doesn't have questionGroupId
          value: Number(value),
          evaluationScale: criterion?.evaluationScale || "HUNDRED",
          comment: selectionCriteriaComments[criterionId] || "",
          createdAt: existingEvaluation?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      });

      console.log("Sending evaluations to backend:", evaluationsToSave);
      const updatedEvaluations = await updateEvaluations(evaluationsToSave);
      setEvaluations(updatedEvaluations);
      alert("Selection criteria evaluations and comments saved successfully!");
    } catch (error) {
      console.error("Failed to save selection criteria evaluations:", error);
      alert("Failed to save selection criteria evaluations and comments");
    } finally {
      setSavingEvaluations(false);
    }
  };

  // Helper function to calculate average score from other staff for a criterion
  const getOtherStaffAverageScore = (criterionId: string): { averageScore: number; evaluationCount: number } => {
    const criterion = selectionCriteria.find(c => c.id === criterionId);
    if (!criterion) return { averageScore: 0, evaluationCount: 0 };
    
    const questionKey = criterion.questionId || criterion.id;
    const relevantEvaluations = otherStaffEvaluations.filter(evaluation => 
      evaluation.questionId === questionKey || evaluation.questionId === criterionId
    );
    
    if (relevantEvaluations.length === 0) return { averageScore: 0, evaluationCount: 0 };
    
    const totalScore = relevantEvaluations.reduce((sum, evaluation) => sum + evaluation.value, 0);
    return { 
      averageScore: totalScore / relevantEvaluations.length, 
      evaluationCount: relevantEvaluations.length 
    };
  };

  // Helper function to get other staff comments for a criterion
  const getOtherStaffComments = (criterionId: string): string[] => {
    const criterion = selectionCriteria.find(c => c.id === criterionId);
    if (!criterion) return [];
    
    const questionKey = criterion.questionId || criterion.id;
    const relevantEvaluations = otherStaffEvaluations.filter(evaluation => 
      (evaluation.questionId === questionKey || evaluation.questionId === criterionId) && 
      evaluation.comment && evaluation.comment.trim() !== ""
    );
    
    return relevantEvaluations.map(evaluation => evaluation.comment || "").filter(comment => comment.trim() !== "");
  };

  const renderQuestions = () =>
    questions
      .filter((q) => q?.question?.id)
      .map((q) => {
        const questionId = q.question.id ?? "";
        const answerValue = answers[questionId] || "";
        console.log(`Question ${questionId}:`, { question: q.question, answer: answerValue });
        return (
          <div className="eligibility-form" key={questionId}>
            {renderInput(
              q.question,
              q.options,
              answerValue,
              () => {} // Read-only
            )}
          </div>
        );
      });

  const renderQuestionGroups = () =>
    questionGroups.map((group) => {
      const groupId = group.id ?? "";
      return (
        <div className="question-group" key={groupId}>
          <h4>{group.name}</h4>
          <p>{group.description}</p>
          {group.questions.map((q: any) => {
            const questionId = q.question.id ?? "";
            const answerValue = answers[groupId]?.[questionId] || "";
            console.log(`Group Question ${questionId}:`, { question: q.question, answer: answerValue });
            return (
              <div className="eligibility-form" key={questionId}>
                {renderInput(
                  q.question,
                  q.options,
                  answerValue,
                  () => {} // Read-only
                )}
              </div>
            );
          })}
        </div>
      );
    });

  const renderEligibilityQuestions = () =>
    eligibilityQuestions.map((item, idx) => {
      return (
        <div key={idx} className="eligibility-form">
          {item.question && (
            <div>
              <h4>Eligibility Question</h4>
              {(() => {
                const questionId = item.question.question.id ?? "";
                const answerValue = answers[questionId] || "";
                console.log(`Eligibility Question ${questionId}:`, { question: item.question.question, answer: answerValue });
                return renderInput(
                  item.question.question,
                  item.question.options,
                  answerValue,
                  () => {} // Read-only
                );
              })()}
              {item.eligibilityCriteria?.simpleCondition && (
                <div className="criteria-info">
                  <p>
                    <strong>Criteria:</strong> Your answer should {item.eligibilityCriteria.simpleCondition.comparisonOperator}{" "}
                    {JSON.stringify(item.eligibilityCriteria.simpleCondition.values)}
                  </p>
                </div>
              )}
            </div>
          )}
          {item.questionGroup && (
            <div>
              <h4>Eligibility Question Group: {item.questionGroup.name}</h4>
              <p>{item.questionGroup.description}</p>
              {item.questionGroup.questions.map((q: any) => {
                const questionCondition = item.eligibilityCriteria?.questionConditions?.find(
                  (c: any) => c.questionId === q.question.id
                );

                return (
                  <div key={q.question.id} className="eligibility-form">
                    {(() => {
                      const questionId = q.question.id;
                      const answerValue = answers[item.questionGroup?.id ?? ""]?.[questionId] || "";
                      console.log(`Eligibility Group Question ${questionId}:`, { question: q.question, answer: answerValue });
                      return renderInput(
                        q.question,
                        q.options,
                        answerValue,
                        () => {} // Read-only
                      );
                    })()}
                    {questionCondition && (
                      <div className="criteria-info">
                        <p>
                          <strong>Criteria:</strong> Your answer should {questionCondition.comparisonOperator}{" "}
                          {JSON.stringify(questionCondition.values)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              {item.eligibilityCriteria?.questionConditions && (
                <div className="criteria-info">
                  <p><strong>Note:</strong> All group conditions must be met for eligibility</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });

  const renderSelectionCriteria = () => {
    if (!selectionCriteria || selectionCriteria.length === 0) {
      return null;
    }

    return (
      <div className="section">
        <h3>Selection Criteria Evaluation</h3>
        {selectionCriteria.map((criterion) => {
          const question = criterion.questionId ? findQuestionById(criterion.questionId) : null;
          const questionGroup = !criterion.questionId ? findQuestionGroupById(criterion.id || "") : null;
          
          // Get other staff scores and comments if user can view them
          const otherStaffData = canViewOtherEvaluations ? getOtherStaffAverageScore(criterion.id || "") : null;
          const otherStaffComments = canViewOtherEvaluations ? getOtherStaffComments(criterion.id || "") : [];
          
          return (
            <div key={criterion.id} className="selection-criteria-item">
              <h4 className="text-lg font-semibold">{criterion.criterionName}</h4>
              <div className="criteria-info text-xs text-gray-500 mb-4">
                <p className="mb-1">
                  <strong className="font-medium">Weight:</strong> {criterion.weight || "Not specified"}
                </p>
                <p className="mb-1">
                  <strong className="font-medium">Evaluation Scale:</strong> {criterion.evaluationScale || "HUNDRED"}
                </p>
              </div>

              {question && (
                <div className="question-display bg-gray-50 p-3 rounded border mb-4">
                  <p className="text-base leading-relaxed mb-2">
                    <strong className="text-sm font-medium text-gray-600">Question:</strong> 
                    <span className="ml-2 text-base font-normal">{question.question.questionText}</span>
                  </p>
                  <p className="text-base leading-relaxed">
                    <strong className="text-sm font-medium text-gray-600">Student Answer:</strong> 
                    <span className="ml-2 text-base font-normal">{answers[question.question.id] || "No answer"}</span>
                  </p>
                </div>
              )}
              
              {questionGroup && (
                <div className="question-group-display bg-gray-50 p-3 rounded border mb-4">
                  <p className="text-base leading-relaxed mb-2">
                    <strong className="text-sm font-medium text-gray-600">Question Group:</strong> 
                    <span className="ml-2 text-base font-normal">{questionGroup.name}</span>
                  </p>
                  <div className="group-questions ml-4 mt-3">
                    {questionGroup.questions.map((q: any) => (
                      <div key={q.question.id} className="group-question bg-white p-3 rounded border mb-2">
                        <p className="text-sm leading-relaxed mb-2">
                          <strong className="text-xs font-medium text-gray-600">Question:</strong> 
                          <span className="ml-2 text-sm font-normal">{q.question.questionText}</span>
                        </p>
                        <p className="text-sm leading-relaxed">
                          <strong className="text-xs font-medium text-gray-600">Student Answer:</strong> 
                          <span className="ml-2 text-sm font-normal">{answers[questionGroup.id]?.[q.question.id] || "No answer"}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show other staff evaluations if user can view them */}
              {canViewOtherEvaluations && otherStaffData && otherStaffData.evaluationCount > 0 && (
                <div className="other-staff-evaluations bg-blue-50 p-3 rounded border mb-4">
                  <h5 className="text-sm font-semibold text-blue-800 mb-2">Other Staff Evaluations</h5>
                  <div className="mb-2">
                    <p className="text-sm text-blue-700">
                      <strong>Average Score:</strong> {otherStaffData.averageScore.toFixed(2)}
                      {criterion.evaluationScale === "HUNDRED" && " / 100"}
                      {criterion.evaluationScale === "TEN" && " / 10"}
                      {criterion.evaluationScale === "FIVE" && " / 5"}
                      {criterion.evaluationScale === "A2E" && " / A-E"}
                      <span className="ml-2 text-xs">({otherStaffData.evaluationCount} evaluation{otherStaffData.evaluationCount > 1 ? 's' : ''})</span>
                    </p>
                  </div>
                  {otherStaffComments.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-blue-600 mb-1">Comments from other staff:</p>
                      <ul className="text-xs text-blue-600 ml-4">
                        {otherStaffComments.map((comment, index) => (
                          <li key={index} className="mb-1 list-disc">{comment}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className="evaluation-input">
                <label>
                  <strong>Evaluation Score:</strong>
                </label>
                <div className="evaluation-input-wrapper flex items-center gap-2">
                  {criterion.evaluationScale === "HUNDRED" ? (
                    <NumberInput
                      id={`eval-${criterion.id}`}
                      name={`eval-${criterion.id}`}
                      label=""
                      value={selectionCriteriaAnswers[criterion.id || ""] || ""}
                      onChange={(e) => handleSelectionCriteriaChange(criterion.id || "", e.target.value === "" ? "" : Number(e.target.value))}
                      disabled={false}
                    />
                  ) : (
                    <Select
                      id={`eval-${criterion.id}`}
                      name={`eval-${criterion.id}`}
                      label=""
                      value={selectionCriteriaAnswers[criterion.id || ""] || ""}
                      onChange={(e) => handleSelectionCriteriaChange(criterion.id || "", e.target.value)}
                      options={getEvaluationScaleOptions(criterion.evaluationScale)}
                    />
                  )}
                  <span className="evaluation-scale-indicator text-gray-600 font-medium">
                    {criterion.evaluationScale === "HUNDRED" && "/ 100"}
                    {criterion.evaluationScale === "TEN" && "/ 10"}
                    {criterion.evaluationScale === "FIVE" && "/ 5"}
                    {criterion.evaluationScale === "A2E" && "/ A-E"}
                  </span>
                </div>
                
                <div style={{ marginTop: "1rem" }}>
                  <Textarea
                    id={`comment-${criterion.id}`}
                    name={`comment-${criterion.id}`}
                    label="Evaluation Comment"
                    value={selectionCriteriaComments[criterion.id || ""] || ""}
                    onChange={(e) => handleSelectionCriteriaCommentChange(criterion.id || "", e.target.value)}
                    placeholder="Add optional comments about this evaluation..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {selectionCriteria.length > 0 && (
          <div className="selection-criteria-actions">
            <Button
              text={savingEvaluations ? "Saving..." : "Save Evaluations"}
              onClick={handleSaveSelectionCriteria}
              type="button"
              variant="primary"
              disabled={savingEvaluations}
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Loading application details...</div>;
  }

  if (!application) {
    return <div>Application not found</div>;
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Review Student Answers"
        headline={`Reviewing answers for application ${applicationId}`}
        provider={true}
      />
      
      <div className="application-info">
        <h3>Application Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Application ID:</strong> {application.id}
          </div>
          <div className="info-item">
            <strong>Student ID:</strong> {application.studentId}
          </div>
          <div className="info-item">
            <strong>Status:</strong> {application.status}
          </div>
          <div className="info-item">
            <strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}
          </div>
          <div className="info-item">
            <strong>Eligibility:</strong> {application.eligibilityResult?.eligible ? "Eligible" : "Not Eligible"}
          </div>
        </div>
      </div>

      <div className="answers-container">
        {eligibilityQuestions.length > 0 && (
          <div className="section">
            <h3>Eligibility Questions</h3>
            {renderEligibilityQuestions()}
          </div>
        )}
        {questions.length > 0 && (
          <div className="section">
            <h3>General Questions</h3>
            {renderQuestions()}
          </div>
        )}
        {questionGroups.length > 0 && (
          <div className="section">
            <h3>Question Groups</h3>
            {renderQuestionGroups()}
          </div>
        )}
        {renderSelectionCriteria()}
      </div>

      <div className="action-buttons">
        <Button
          text="Back to Applications"
          onClick={() => navigate(-1)}
          type="button"
          variant="outline"
        />
      </div>
    </div>
  );
};

export default ReviewStudentAnswer;

