import React, { useState, useEffect } from "react";
import type {ApplicationDto, EligibilityCriteriaWithQuestionDto, StudentAnswerDto } from "../../types/application";
import { renderInput } from "../../utility/QuestionInput";
import { updateAnswers, getAnswersByApplicationId } from "../../services/ApplicationService";
import Button from "../../components/basicComponents/Button";
import { formatDateForBackend } from "../../components/inputComponents/datePickers/utils";
import { doesAnswerMeetCriteria } from "../../utility/criteriaUtils";

interface EligibilityProps {
  eligibilityCriteriaWithQuestion: EligibilityCriteriaWithQuestionDto[];
  application: ApplicationDto | null;
  studentId: string;
  grantProgramId: string;
}

const Eligibility: React.FC<EligibilityProps> = ({
  eligibilityCriteriaWithQuestion,
  application,
  studentId,
  grantProgramId,
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (!studentId || !application?.id) return;
      try {
        const backendAnswers = await getAnswersByApplicationId(studentId, application.id);
        console.log(backendAnswers);
        // Convert StudentAnswerDto[] to answers object
        const initialAnswers: Record<string, any> = {};
        backendAnswers.forEach((dto) => {
          if (dto.questionGroupId) {
            if (!initialAnswers[dto.questionGroupId]) initialAnswers[dto.questionGroupId] = {};
            dto.answer.forEach(ans => {
              initialAnswers[dto.questionGroupId][ans.questionId] = Array.isArray(ans.answer) && ans.answer.length === 1 ? ans.answer[0] : ans.answer;
            });
          } else {
            // Single question
            if (dto.answer && dto.answer.length > 0) {
              initialAnswers[dto.questionId] = Array.isArray(dto.answer[0].answer) && dto.answer[0].answer.length === 1
                ? dto.answer[0].answer[0]
                : dto.answer[0].answer;
            }
          }
        });
        setAnswers(initialAnswers   );
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchAnswers();
  }, [studentId, application?.id]);

  const handleAnswerChange = (
  id: string,
  value: any,
  questionGroupId?: string
) => {
  if (questionGroupId) {
    setAnswers((prev) => ({
      ...prev,
      [questionGroupId]: {
        ...(prev[questionGroupId] || {}),
        [id]: value,
      },
    }));
  } else {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitError(null);
  setSubmitSuccess(null);

  const answerDtos: StudentAnswerDto[] = [];
  try{
console.log("original Answer is ", answers);
  Object.entries(answers).forEach(([key, value]) => {
    if (typeof value === "object" && value.year == null) {
      // question group
      const groupAnswers: Answer[] = Object.entries(value).map(([questionId, answerValue]) => ({
        questionId,
        answer: [answerValue],
      }));
      answerDtos.push({
        id: key,
        studentId,
        questionId: "",
        applicationId: [application?.id] || [],
        questionGroupId: key,
        answer: groupAnswers,
        questionText: "",
        optionText: "",
      });
    } else {
      // single question
      answerDtos.push({
        id: key,
        studentId,
        questionId: key,
        applicationId: [application?.id] || [],
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
    console.log("answer")
    console.log(answerDtos);
    const response = await updateAnswers(studentId, grantProgramId, answerDtos);
    setSubmitSuccess("Answers submitted successfully.");
    console.log(response);

  } catch (err: any) {
    setSubmitError("Failed to submit answers.");
  } finally {
    setIsSubmitting(false);
  }
};

  if (!eligibilityCriteriaWithQuestion || eligibilityCriteriaWithQuestion.length === 0) {
    return <div>No eligibility criteria found for this grant program.</div>;
  }

  return (
    <div className="content">
      <h2>Eligibility Criteria</h2>
      <form className="eligibility-forms" onSubmit={handleSubmit}>
        {eligibilityCriteriaWithQuestion.map((item, idx) => (
          <div key={idx} className="eligibility-form">
            {item.question && (
              <div>
                {renderInput(
                  item.question.question,
                  item.question.options,
                  answers[item.question.question.id],
                  (id, value) => handleAnswerChange(id, value)
                )}
                {/* Render criteria info for single question */}
                {item.eligibilityCriteria?.simpleCondition && (
                  <div className="criteria-info">
                    <strong>Criteria:</strong>{" "}
                    Operator: {item.eligibilityCriteria.simpleCondition.comparisonOperator}, Values: {JSON.stringify(item.eligibilityCriteria.simpleCondition.values)}
                    <br />
                    <strong>Answer:</strong> {JSON.stringify(answers[item.question.question.id])}
                    <br />
                    <strong>Meets Criteria:</strong>{" "}
                    {doesAnswerMeetCriteria(
                      answers[item.question.question.id],
                      item.eligibilityCriteria.simpleCondition.comparisonOperator,
                      item.eligibilityCriteria.simpleCondition.values
                    )
                      ? "✅"
                      : "❌"}
                  </div>
                )}
              </div>
            )}
            {item.questionGroup &&
              item.questionGroup.questions.map((q: any, qIdx: number) => (
                <div key={qIdx} className="question-group">
                  {renderInput(
                    q.question,
                    q.options,
                    answers[item.questionGroup.id]?.[q.question.id],
                    (id, value) => handleAnswerChange(id, value, item.questionGroup.id)
                  )}
                  {/* Render criteria info for question group */}
                  {item.eligibilityCriteria?.questionConditions &&
                    (() => {
                      const condition = item.eligibilityCriteria.questionConditions.find(
                        (cond: any) => cond.questionId === q.question.id
                      );
                      if (!condition) return null;
                      return (
                        <div className="criteria-info">
                          <strong>Criteria:</strong>{" "}
                          Operator: {condition.comparisonOperator}, Values: {JSON.stringify(condition.values)}
                          <br />
                          <strong>Answer:</strong> {JSON.stringify(answers[item.questionGroup.id]?.[q.question.id])}
                          <br />
                          <strong>Meets Criteria:</strong>{" "}
                          {doesAnswerMeetCriteria(
                            answers[item.questionGroup.id]?.[q.question.id],
                            condition.comparisonOperator,
                            condition.values
                          )
                            ? "✅"
                            : "❌"}
                        </div>
                      );
                    })()}
                </div>
              ))}
          </div>
        ))}
        <Button
            text={isSubmitting ? "Submitting..." : "Submit"}
            type="submit"
            disabled={isSubmitting}
        />
        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">{submitSuccess}</div>}
      </form>
    </div>
  );
};

export default Eligibility;

