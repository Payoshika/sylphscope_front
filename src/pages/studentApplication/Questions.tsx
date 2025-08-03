import React from "react";
import type { QuestionEligibilityInfoDto, QuestionGroupEligibilityInfoDto } from "../../data/questionEligibilityInfoDto";
import type { ApplicationDto } from "../../types/application";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import { renderInput } from "../../utility/QuestionInput";
import Button from "../../components/basicComponents/Button";

interface QuestionsProps {
  questions: QuestionEligibilityInfoDto[];
  questionGroups: QuestionGroupEligibilityInfoDto[];
  application: ApplicationDto | null;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  handleAnswerChange: (id: string, value: any, groupId?: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: string | null;
}

const Questions: React.FC<QuestionsProps> = ({ 
  questions, 
  questionGroups, 
  application,
  answers, 
  setAnswers, 
  handleAnswerChange, 
  handleSubmit, 
  isSubmitting, 
  submitError, 
  submitSuccess 
}) => {
  const isReadOnly = application?.status !== "draft";

  // Render individual questions
  const renderQuestions = () =>
    questions
      .filter((q) => q?.question?.id)
      .map((q) => {
        console.log("question", q);
        const questionId = q.question.id ?? "";
        return (
          <div className={`eligibility-form ${isReadOnly ? "eligibility-form--readonly" : ""}`} key={questionId}>
            {renderInput(
              q.question,
              q.options,
              answers[questionId] || "",
              isReadOnly ? () => {} : (id, value) => handleAnswerChange(id, value)
            )}
          </div>
        );
      });

  // Render question groups
  const renderQuestionGroups = () =>
    questionGroups.map((group) => {
        console.log("group", group);
      const groupId = group.id ?? "";
      return (
        <div className={`question-group ${isReadOnly ? "question-group--readonly" : ""}`} key={groupId}>
          <h4>{group.name}</h4>
          <p>{group.description}</p>
          {group.questions.map((q) => {
            const questionId = q.question.id ?? "";
            return (
              <div className={`eligibility-form ${isReadOnly ? "eligibility-form--readonly" : ""}`} key={questionId}>
                {renderInput(
                  q.question,
                  q.options,
                  answers[groupId]?.[questionId] || "",
                  isReadOnly ? () => {} : (id, value) => handleAnswerChange(id, value, groupId)
                )}
              </div>
            );
          })}
        </div>
      );
    });

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Questions for Applicants"
        headline="Please answer the following questions."
        student={true}
      />
      
      {isReadOnly && (
        <div className="read-only-notice">
          <p>This application is in read-only mode. The application status is: <strong>{application?.status}</strong></p>
        </div>
      )}
      
      <form className="eligibility-forms" onSubmit={handleSubmit}>
        {renderQuestions()}
        {renderQuestionGroups()}
        {!isReadOnly && (
          <Button
            text={isSubmitting ? "Submitting..." : "Submit Questions"}
            type="submit"
            disabled={isSubmitting}
          />
        )}
        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">{submitSuccess}</div>}
      </form>
    </div>
  );
};

export default Questions;
