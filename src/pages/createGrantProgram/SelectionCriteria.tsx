import React, { useEffect, useState } from "react";
import type { GrantProgram, EvaluationScale } from "../../types/grantProgram";
import type { QuestionEligibilityInfoDto } from "../../data/questionEligibilityInfoDto";
import type { SelectionCriterion } from "../../types/grantProgram";
import TitleAndHeadLine from "./TitleAndHeadLine";
import Button from "../../components/basicComponents/Button";
import { getSelectionCriteria, updateSelectionCriteria } from "../../services/GrantProgramService";
import Select from "../../components/inputComponents/Select";
import NumberInput from "../../components/inputComponents/NumberInput";
import CrossSign from "../../components/icons/CrossSign";
import TextInput from "../../components/inputComponents/TextInput";

interface SelectionCriteriaProps {
  grantProgram: GrantProgram;
  setGrantProgram: React.Dispatch<React.SetStateAction<GrantProgram>>;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
  selectedQuestions: QuestionEligibilityInfoDto[];
}

const evaluationTypeOptions = [
  { value: "MANUAL", label: "Manual" },
  { value: "AUTO", label: "Auto" },
];

const evaluationScaleOptions = [
  { value: "HUNDRED", label: "0-100" },
  { value: "TEN", label: "0-10" },
  { value: "FIVE", label: "0-5" },
  { value: "A2E", label: "A-E" },
];

const SelectionCriteria: React.FC<SelectionCriteriaProps> = ({
  grantProgram,
  setGrantProgram,
  onUpdateGrant,
  selectedQuestions,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [selectedSelectionCriteria, setSelectedSelectionCriteria] = useState<SelectionCriterion[]>([]);
  const [evaluationScale, setEvaluationScale] = useState<EvaluationScale>(
    grantProgram.evaluationScale ?? "TEN"
  );
  const [showCustomCriteriaInput, setShowCustomCriteriaInput] = useState(false);
  const [customCriteriaName, setCustomCriteriaName] = useState("");
  const [customCriteriaError, setCustomCriteriaError] = useState("");


  useEffect(() => {
    const fetchSelectionCriteria = async () => {
      if (grantProgram.id) {
        try {
          const criteria = await getSelectionCriteria(grantProgram.id);
            console.log("existing criteria is ", criteria)
          setSelectedSelectionCriteria(criteria);
        } catch (err) {
          setSelectedSelectionCriteria([]);
        }
      }
    };
    fetchSelectionCriteria();
  }, [grantProgram.id]);

  // Update all criteria's evaluationScale if changed
  useEffect(() => {
    setSelectedSelectionCriteria(prev =>
      prev.map(c => ({
        ...c,
        evaluationScale,
      }))
    );
  }, [evaluationScale]);

  // Collect all questionIds and questionGroupIds from selectedSelectionCriteria
  const disabledQuestionIds = selectedSelectionCriteria.map(c => c.questionId);
  const disabledGroupIds = selectedSelectionCriteria.map(c => c.questionGroupId).filter(Boolean);

  const handleEvaluationTypeChange = (questionId: string, value: "MANUAL" | "AUTO") => {
  setSelectedSelectionCriteria(prev =>
    prev.map(c =>
      c.questionId === questionId
        ? { ...c, evaluationType: value }
        : c
    )
  );
};

  const handleAddCustomCriterion = () => {
    if (!customCriteriaName.trim()) {
      setCustomCriteriaError("Please enter a name for the custom criterion.");
      return;
    }
    setCustomCriteriaError("");
    const newCriterion: SelectionCriterion = {
      grantProgramId: grantProgram.id,
      criterionName: customCriteriaName.trim(),
      questionType: "SINGLE",
      questionId: undefined,
      weight: 0,
      evaluationType: "MANUAL",
      evaluationScale: evaluationScale,
    };
    setSelectedSelectionCriteria(prev => {
      const updated = [...prev, newCriterion];
      const equalWeight = Math.floor(100 / updated.length);
      const remainder = 100 - equalWeight * updated.length;
      return updated.map((c, idx) => ({
        ...c,
        weight: idx === 0 ? equalWeight + remainder : equalWeight,
        evaluationScale: evaluationScale,
      }));
    });
    setCustomCriteriaName("");
    setShowCustomCriteriaInput(false);
  };

  // Add criterion and show input for weight
  const handleAddSelectionCriterion = (question: QuestionEligibilityInfoDto) => {
    if (
      disabledQuestionIds.includes(question.question.id) ||
      disabledGroupIds.includes(question.question.id) ||
      selectedSelectionCriteria.some(c => c.questionId === question.question.id)
    )
      return;

    const newCriterion: SelectionCriterion = {
      grantProgramId: grantProgram.id,
      criterionName: question.question.name,
      questionType: "SINGLE",
      questionId: question.question.id,
      weight: 0,
      evaluationType: "MANUAL",
      evaluationScale: evaluationScale,
    };

    setSelectedSelectionCriteria(prev => {
      const updated = [...prev, newCriterion];
      const equalWeight = Math.floor(100 / updated.length);
      const remainder = 100 - equalWeight * updated.length;
      return updated.map((c, idx) => ({
        ...c,
        weight: idx === 0 ? equalWeight + remainder : equalWeight,
        evaluationScale: evaluationScale,
      }));
    });
  };

  // Remove criterion
  const handleRemoveSelectionCriterion = (questionId: string) => {
    setSelectedSelectionCriteria(prev => prev.filter(c => c.questionId !== questionId));
  };

  // Handle weight change directly in selectedSelectionCriteria
const handleWeightChange = (questionId: string, value: number) => {
  setSelectedSelectionCriteria(prev => {
    const idx = prev.findIndex(c => c.questionId === questionId);
    if (idx === -1) return prev;

    const oldWeight = prev[idx].weight ?? 0;
    const delta = value - oldWeight;
    let updated = [...prev];

    if (delta !== 0) {
      if (idx === 0 && updated.length > 1 && delta > 0) {
        // Increasing first: decrease next
        const nextWeight = updated[1].weight ?? 0;
        const newNextWeight = Math.max(0, nextWeight - delta);
        updated[1] = { ...updated[1], weight: newNextWeight };
      } else if (idx === updated.length - 1 && updated.length > 1 && delta > 0) {
        // Increasing last: decrease previous
        const prevWeight = updated[idx - 1].weight ?? 0;
        const newPrevWeight = Math.max(0, prevWeight - delta);
        updated[idx - 1] = { ...updated[idx - 1], weight: newPrevWeight };
      } else if (delta > 0 && idx < updated.length - 1) {
        // Increasing middle: decrease next
        const nextWeight = updated[idx + 1].weight ?? 0;
        const newNextWeight = Math.max(0, nextWeight - delta);
        updated[idx + 1] = { ...updated[idx + 1], weight: newNextWeight };
      } else if (delta < 0 && idx > 0) {
        // Decreasing: increase previous
        const prevWeight = updated[idx - 1].weight ?? 0;
        const newPrevWeight = Math.max(0, prevWeight - delta); // -delta is positive
        updated[idx - 1] = { ...updated[idx - 1], weight: newPrevWeight };
      }
      updated[idx] = { ...updated[idx], weight: Math.max(0, Math.min(100, value)) };
    }
    return updated;
  });
};

  // Calculate total weight
  const totalWeight = selectedSelectionCriteria.reduce((sum, c) => sum + (c.weight || 0), 0);

  // Render selected questions as buttons, disabling if in selection criteria
const renderSelectedQuestionButtons = () => (
  <>
    {selectedQuestions.map((question) => {
      const isDisabled =
        disabledQuestionIds.includes(question.question.id) ||
        disabledGroupIds.includes(question.question.id) ||
        selectedSelectionCriteria.some(c => c.questionId === question.question.id);
      return (
        <div className="selection-criteria__question-btn" key={question.question.id}>
          <Button
            text={question.question.name}
            type="button"
            disabled={isDisabled}
            variant={isDisabled ? "primary" : "outline"}
            className="selection-criteria__btn"
            onClick={() => handleAddSelectionCriterion(question)}
          />
        </div>
      );
    })}
    <div className="selection-criteria__question-btn">
      {showCustomCriteriaInput ? (
        <div className="selection-criteria__custom-input-row">
          <TextInput
            id="custom-criteria-name"
            name="customCriteriaName"
            label=""
            placeholder="Custom selection criteria name"
            value={customCriteriaName}
            onChange={e => setCustomCriteriaName(e.target.value)}
            autoFocus
          />
          <Button
            text="Add"
            type="button"
            onClick={handleAddCustomCriterion}
            size="small"
          />
          <Button
            text="Cancel"
            type="button"
            variant="ghost"
            onClick={() => {
              setShowCustomCriteriaInput(false);
              setCustomCriteriaName("");
              setCustomCriteriaError("");
            }}
            size="small"
          />
        </div>
      ) : (
        <Button
          text="Create Custom Selection Criteria"
          type="button"
          variant="outline"
          className="selection-criteria__btn"
          onClick={() => setShowCustomCriteriaInput(true)}
        />
      )}
      {customCriteriaError && (
        <div className="error-message">{customCriteriaError}</div>
      )}
    </div>
  </>
);

  // Render input for each selected criterion
const renderSelectedCriteriaInputs = () =>
  selectedSelectionCriteria.map((criterion) => (
    <div className="selection-criteria__input-row" key={criterion.questionId}>
      <NumberInput
        id={`weight-${criterion.questionId}`}
        name={`weight-${criterion.questionId}`}
        label={criterion.criterionName}
        value={criterion.weight ?? 0}
        onChange={e => handleWeightChange(criterion.questionId, Number(e.target.value))}
        min={0}
        max={100}
        suffix="%"
        className="selection-criteria__input"
      />
      <Select
        id={`evaluation-type-${criterion.questionId}`}
        name={`evaluationType-${criterion.questionId}`}
        value={criterion.evaluationType}
        onChange={e => handleEvaluationTypeChange(criterion.questionId, e.target.value as "MANUAL" | "AUTO")}
        options={evaluationTypeOptions}
        className="selection-criteria__evaluation-type"
        label="Evaluation Type"
        required
      />
      <button
        type="button"
        className="selection-criteria__remove-btn"
        onClick={() => handleRemoveSelectionCriterion(criterion.questionId)}
        aria-label="Remove selection criterion"
      >
        <CrossSign width={22} height={22} />
      </button>
    </div>
  ));

const handleSaveSelectionCriteria = async () => {
  if (totalWeight !== 100) {
    setSubmitError("Total weight must be exactly 100%");
    setSubmitSuccess(null);
    return;
  }
  setIsSubmitting(true);
  setSubmitError(null);
  setSubmitSuccess(null);
  try {
    console.log("sending", grantProgram.id, selectedSelectionCriteria);
    const response = await updateSelectionCriteria(grantProgram.id, selectedSelectionCriteria);
    console.log("response is ", response)
    if (response?.data) {
      setGrantProgram((prev) => ({ ...prev, selectionCriteria: response.data }));
    }
    console.log("current Grant program is ", grantProgram);
    setSubmitSuccess("Selection criteria saved.");
  } catch (err) {
    setSubmitError("Failed to save selection criteria.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
      <div className="content">
        <TitleAndHeadLine
          title="Create Selection Criteria for the program"
          headline="Create Custom Selection Criteria for your programme"
          provider={true}
        />
        <div className="form-group">
          <Select
            id="evaluation-scale"
            name="evaluationScale"
            label="Evaluation Scale"
            value={evaluationScale}
            onChange={e => setEvaluationScale(e.target.value as EvaluationScale)}
            options={evaluationScaleOptions}
            required
          />
        </div>
        <div className="form-group eligibility-lists">
          {renderSelectedQuestionButtons()}
        </div>
        <div className="form-group eligibility-forms">
          {renderSelectedCriteriaInputs()}
          <div className="selection-criteria__total">
            Total: {totalWeight}%
          </div>
        </div>
        <Button
          text={isSubmitting ? "Saving..." : "Save Selection Criteria"}
          type="button"
          disabled={isSubmitting || totalWeight !== 100 || selectedSelectionCriteria.length === 0}
          onClick={handleSaveSelectionCriteria}
        />
        {submitError && <div className="error-message">{submitError}</div>}
        {submitSuccess && <div className="success-message">{submitSuccess}</div>}
      </div>
  );
}
export default SelectionCriteria;