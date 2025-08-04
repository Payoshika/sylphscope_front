import React, { useEffect, useState } from "react";
import type {
  QuestionEligibilityInfoDto,
  QuestionGroupEligibilityInfoDto,
  EligibilityCriteriaDTO,
  Option,
  InputType,
  DataType,
} from "../../data/questionEligibilityInfoDto";
import Button from "../../components/basicComponents/Button";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import Modal from "../../components/basicComponents/Modal";
import QuestionForm from "./QuestionForm";
import QuestionDisplay from "./QuestionDisplay";
import { updateQuestion } from "../../services/GrantProgramService";
import type { GrantProgram } from "../../types/grantProgram";
import { GrantStatus } from "../../types/grantProgram";
import { useNavigate } from "react-router-dom";

interface ChooseOrCreateQuestionProps {
  grantProgram: GrantProgram;
  onUpdateGrant: () => Promise<any>; 
  questions: QuestionEligibilityInfoDto[]; // this is all the questions in the db 
  questionGroups: QuestionGroupEligibilityInfoDto[]; // this is all the question Groups in the db
  eligibilities: EligibilityCriteriaDTO[]; // this is all the eligibility criteria for this grant program
  selectedQuestions: QuestionEligibilityInfoDto[]; //this is the selected question for this grantprogram
  setSelectedQuestions: React.Dispatch<React.SetStateAction<QuestionEligibilityInfoDto[]>>;
  onChooseQuestion?: (question: QuestionEligibilityInfoDto) => void;
  onChooseGroup?: (group: QuestionGroupEligibilityInfoDto) => void;
}

const ChooseOrCreateQuestion: React.FC<ChooseOrCreateQuestionProps> = ({
  grantProgram,
  onUpdateGrant,
  questions,
  questionGroups,
  eligibilities,
  selectedQuestions,
  setSelectedQuestions,
  onChooseQuestion,
  onChooseGroup,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [localQuestionIds, setLocalQuestionIds] = useState<string[]>(grantProgram.questionIds || []);
  const navigate = useNavigate();

  // Check if the program is in draft status
  const isReadOnly = grantProgram.status !== GrantStatus.DRAFT;

  useEffect(() => {
    setLocalQuestionIds(grantProgram.questionIds || []);
    setSelectedQuestions(
      questions.filter(q => (grantProgram.questionIds || []).includes(q.question.id as string))
    );
  }, [grantProgram.questionIds, questions]);

  const handleChooseQuestion = (question: QuestionEligibilityInfoDto) => {
    if (isReadOnly) return;
    if (!selectedQuestions.some(q => q.question.id === question.question.id)) {
      setSelectedQuestions(prev => [...prev, question]);
      setLocalQuestionIds(prev => [...prev, question.question.id as string]);
      onChooseQuestion?.(question);
    }
  };

  const handleChooseGroup = (group: QuestionGroupEligibilityInfoDto) => {
    if (isReadOnly) return;
    setSelectedQuestions(prev => {
      const newQuestions = group.questions.filter(
        q => !prev.some(selected => selected.question.id === q.question.id)
      );
      return [...prev, ...newQuestions];
    });
    onChooseGroup?.(group);
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (isReadOnly) return;
    setSelectedQuestions(prev => prev.filter(q => q.question.id !== questionId));
    setLocalQuestionIds(prev => prev.filter(id => id !== questionId));
  };

  const handleCreateCustomQuestion = (question: {
    name: string;
    questionText: string;
    inputType: InputType;
    questionDataType: DataType;
    options?: Option[];
  }) => {
    if (isReadOnly) return;
    const newQuestion: QuestionEligibilityInfoDto = {
      question: {
        id: Math.random().toString(36).slice(2),
        name: question.name,
        questionText: question.questionText,
        inputType: question.inputType,
        questionDataType: question.questionDataType,
        description: "",
        isRequired: false,
      },
      options: question.options || [],
      operators: [],
    };
    setSelectedQuestions(prev => [...prev, newQuestion]);
    setShowModal(false);
  };

  const handleSubmitQuestions = async () => {
    if (isReadOnly) return;
    event?.preventDefault?.();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const result = await updateQuestion(grantProgram.id || "686cf160f9b36c21721c30d8", selectedQuestions);
      if (result) {
        await onUpdateGrant();
        setSubmitSuccess("Questions updated successfully.");
        navigate("../selection-criteria");
      } else {
        throw new Error("Update failed");
      }
      setSubmitSuccess("Questions updated successfully.");
    } catch (err) {
      setSubmitError("Failed to update questions.");
    } finally {
      setIsSubmitting(false);
    }
  };

    // Logic for disabling questions/groups
  const eligibilityQuestionIds = eligibilities
    .filter(e => e.questionId)
    .map(e => e.questionId);

  const eligibilityGroupIds = eligibilities
    .filter(e => e.questionGroupId)
    .map(e => e.questionGroupId);

  const selectedQuestionIds = selectedQuestions.map(q => q.question.id);


  const isQuestionDisabled = (questionId: string) =>
  eligibilityQuestionIds.includes(questionId) ||
  selectedQuestionIds.includes(questionId) ||
  localQuestionIds.includes(questionId);

  const isGroupDisabled = (groupId: string) =>
    eligibilityGroupIds.includes(groupId) ||
    (grantProgram.questionGroupsIds || []).includes(groupId);
  // Render question buttons
  const renderQuestionButtons = () =>
    questions
      .filter((question) => question?.question?.id !== undefined)
      .map((question) => (
        <Button
          key={question.question.id}
          text={question.question.name}
          onClick={() => handleChooseQuestion(question)}
          type="button"
          disabled={isQuestionDisabled(question.question.id ?? "") || isReadOnly}
          variant={isQuestionDisabled(question.question.id ?? "") ? "primary" : "outline"}
        />
      ));

  // Render group buttons
  const renderGroupButtons = () =>
    questionGroups.map((group) => (
      <Button
        key={group.id}
        text={group.name}
        onClick={() => handleChooseGroup(group)}
        type="button"
        disabled={isGroupDisabled(group.id) || isReadOnly}
        variant={isGroupDisabled(group.id) ? "primary" : "outline"}
      />
    ));

  // Render selected questions
  const renderSelectedQuestions = () =>
    selectedQuestions
      .filter((question) => question?.question?.id !== undefined)
      .map((question) => (
        <div className="eligibility-form" key={question.question.id}>
          <QuestionDisplay
            question={question}
            inputAllowed={true}
            onRemove={() => handleRemoveQuestion(question.question.id ?? "")}
          />
        </div>
      ));

  return (
    <div className="content">
      <TitleAndHeadLine
        title="Create Questions to Applicants"
        headline="Create Questions for applying to your programme"
        provider={true}
      />
      
      {isReadOnly && (
        <div className="read-only-notice">
          <p>This grant program is currently in "{grantProgram.status}" status and cannot be modified.</p>
        </div>
      )}
      
      <div className={`form-group eligibility-lists ${isReadOnly ? 'form-group--readonly' : ''}`}>
        {renderQuestionButtons()}
        {renderGroupButtons()}
        <p className="info-text">
          Questions that are chosen in the eligibility criteria section are disabled as they are already chosen.
        </p>
      </div>
      <div className="eligibility-forms">
        {renderSelectedQuestions()}
      </div>
      <Button
        text="Create Custom Question"
        type="button"
        onClick={() => setShowModal(true)}
        disabled={isReadOnly}
      />
      <Button
        text={isSubmitting ? "Saving..." : "Save Questions"}
        type="button"
        disabled={isSubmitting || isReadOnly}
        onClick={handleSubmitQuestions}
      />
      {submitError && <div className="error-message">{submitError}</div>}
      {submitSuccess && <div className="success-message">{submitSuccess}</div>}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Custom Question"
      >
        <QuestionForm onCreate={handleCreateCustomQuestion} />
      </Modal>
    </div>
  );
};

export default ChooseOrCreateQuestion;