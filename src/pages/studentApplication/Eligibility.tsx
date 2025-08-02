import React from "react";
import type {ApplicationDto, EligibilityCriteriaWithQuestionDto } from "../../types/application";
import { renderInput } from "../../utility/QuestionInput";
import Button from "../../components/basicComponents/Button";
import { doesAnswerMeetCriteria } from "../../utility/CriteriaUtils";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";

interface EligibilityProps {
  eligibilityCriteriaWithQuestion: EligibilityCriteriaWithQuestionDto[];
  application: ApplicationDto | null;
  studentId: string;
  grantProgramId: string;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  handleAnswerChange: (id: string, value: any, questionGroupId?: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: string | null;
}

const Eligibility: React.FC<EligibilityProps> = ({
  eligibilityCriteriaWithQuestion,
  answers,
  handleAnswerChange,
  handleSubmit,
  isSubmitting,
  submitError,
  submitSuccess,
}) => {

  if (!eligibilityCriteriaWithQuestion || eligibilityCriteriaWithQuestion.length === 0) {
    return <div>No eligibility criteria found for this grant program.</div>;
  }

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Eligibility Criteria"
        headline="Answer questions to see if you are eligible for the grant"
        student={true}
      />
      <form className="eligibility-forms" onSubmit={handleSubmit}>
        {eligibilityCriteriaWithQuestion.map((item, idx) => {
          // Determine eligibility for single question
          let isEligible = true;
          if (item.question && item.eligibilityCriteria?.simpleCondition) {
            isEligible = doesAnswerMeetCriteria(
              answers[item.question.question.id ?? ""],
              item.eligibilityCriteria.simpleCondition.comparisonOperator,
              item.eligibilityCriteria.simpleCondition.values
            );
          }
          // For question group, eligible if all conditions are met
          if (item.questionGroup && item.eligibilityCriteria?.questionConditions) {
            isEligible = item.questionGroup.questions.every((q: any) => {
              const cond = item.eligibilityCriteria?.questionConditions?.find(
                (c: any) => c.questionId === q.question.id
              );
              if (!item.questionGroup) return true;
              if (!cond) return true;
              return doesAnswerMeetCriteria(
                answers[item.questionGroup?.id ?? ""]?.[q.question.id],
                cond.comparisonOperator,
                cond.values
              );
            });
          }

          return (
            <div
              key={idx}
              className={`eligibility-form ${
                isEligible ? "eligibility-form--eligible" : "eligibility-form--ineligible"
              }`}
            >
              {item.question && (
                <div>
                  {renderInput(
                    item.question.question,
                    item.question.options,
                    answers?.[item.question.question.id ?? ""],
                    (id, value) => handleAnswerChange(id, value)
                  )}
                  {/* Render criteria info for single question */}
                  {item.eligibilityCriteria?.simpleCondition && (
                    <div className="criteria-info">
                      <p className={`eligibility-message-${isEligible ? "eligible" : "ineligible"}`}>{isEligible ? "Eligible" : "Ineligible"}</p>
                      <p>
                        criteria: your answer should {item.eligibilityCriteria.simpleCondition.comparisonOperator}{" "}
                        {JSON.stringify(item.eligibilityCriteria.simpleCondition.values)}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {item.questionGroup && (
                <div>
                  {item.questionGroup.questions.map((q: any) => {
                    // Find the specific condition for this question
                    const questionCondition = item.eligibilityCriteria?.questionConditions?.find(
                      (c: any) => c.questionId === q.question.id
                    );
                    
                    // Determine eligibility for this specific question
                    let questionIsEligible = true;
                    if (questionCondition) {
                      questionIsEligible = doesAnswerMeetCriteria(
                        answers?.[item.questionGroup?.id ?? ""]?.[q.question.id],
                        questionCondition.comparisonOperator,
                        questionCondition.values
                      );
                    }

                    return (
                      <div key={q.question.id}>
                        {renderInput(
                          q.question,
                          q.options,
                          answers?.[item.questionGroup?.id ?? ""]?.[q.question.id],
                          (id, value) => handleAnswerChange(id, value, item.questionGroup?.id)
                        )}
                        {/* Render criteria info for each question in the group */}
                        {questionCondition && (
                          <div className="criteria-info">
                            <p className={`eligibility-message-${questionIsEligible ? "eligible" : "ineligible"}`}>
                              {questionIsEligible ? "Eligible" : "Ineligible"}
                            </p>
                            <p>
                              criteria: your answer should {questionCondition.comparisonOperator}{" "}
                              {JSON.stringify(questionCondition.values)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Overall group eligibility message */}
                  {item.eligibilityCriteria?.questionConditions && (
                    <div className="criteria-info">
                      <p className={`eligibility-message-${isEligible ? "eligible" : "ineligible"}`}>
                        Overall: {isEligible ? "Eligible" : "Ineligible"}
                      </p>
                      <p>All group conditions must be met for overall eligibility</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <Button
          text={isSubmitting ? "Submitting..." : "Submit Eligibility"}
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

