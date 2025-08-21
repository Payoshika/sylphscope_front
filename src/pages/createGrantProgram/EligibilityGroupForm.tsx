import React, { useState } from "react";
import type { EligibilityGroupFormState, ComparisonOperator, QuestionConditionPair } from "../../data/questionEligibilityInfoDto";
import TextInput from "../../components/inputComponents/TextInput";
import Button from "../../components/basicComponents/Button";
import EligibilityForm from "./EligibilityForm";
import CrossSign from "../../components/icons/CrossSign";

interface EligibilityGroupFormProps {
  group: EligibilityGroupFormState;
  onCreate: (group: EligibilityGroupFormState) => void;
  onUpdateCondition?: (groupId: string, idx: number, condition: QuestionConditionPair) => void;
  onDuplicate?: (groupId: string) => void;
  onRemove?: (groupId: string) => void;
  isReadOnly?: boolean; // <-- new prop propagated from parent
  initialCollapsed?: boolean;
  pending?: boolean;
}

const EligibilityGroupForm: React.FC<EligibilityGroupFormProps> = ({  group,
  onCreate,
  onUpdateCondition,
  onDuplicate,
  onRemove,
  isReadOnly = false,
  initialCollapsed = false,
  pending = true,
}) => {
  const [groupName, setGroupName] = useState(group.groupName);
  const [questionConditions, setQuestionConditions] = useState<QuestionConditionPair[]>(group.questionConditions);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [pendingStatus, setPendingStatus] = useState(pending);

  const handleConditionChange = (idx: number, operator: ComparisonOperator, values: any[]) => {
    if (isReadOnly) return;
    const updated = questionConditions.map((pair, i) =>
      i === idx
        ? {
            ...pair,
            condition: {
              ...pair.condition,
              comparisonOperator: operator,
              values,
            },
          }
        : pair
    );
    setQuestionConditions(updated);
    if (onUpdateCondition) {
      onUpdateCondition(group.groupId, idx, updated[idx]);
    }
  };

  const handleCreate = () => {
    if (isReadOnly) return;
    onCreate({
        ...group,
        groupName,
        questionConditions,
    });
    setCollapsed(true);
    setPendingStatus(false);
    console.log(pendingStatus)
    };

  return (
    <div className="eligibility-group-forms">
      <form className={`eligibility-group-form${pendingStatus ? " eligibility-group-form--pending" : ""}`}>
        <div style={{ position: "relative" }}>
          {collapsed ? (
            <div className="group-collapsed-row">
              <button
                type="button"
                className="group-name-collapsed"
                onClick={() => !isReadOnly && setCollapsed(false)}
              >
                {groupName}
              </button>
              {!isReadOnly && (
                <>
                  <button
                    type="button"
                    className="group-duplicate-btn"
                    onClick={() => onDuplicate && onDuplicate(group.groupId)}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="group-remove-btn"
                    onClick={() => onRemove && onRemove(group.groupId)}
                    aria-label="Remove group"
                  >
                    <CrossSign width={22} height={22} />
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="group-header-row">
                <TextInput
                  id={`group-name-${group.groupId}`}
                  name={`groupName-${group.groupId}`}
                  label="Custom Condition Name"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  required
                />
              </div>
            </>
          )}
        </div>
        {!collapsed && (
          <>
            <div className="group-questions">
              {questionConditions.map((pair, idx) => (
                <EligibilityForm
                  key={pair.question.question.id}
                  data={pair.question}
                  grantProgramId={""}
                  operator={pair.condition.comparisonOperator}
                  values={pair.condition.values}
                  onChange={(operator, values) => handleConditionChange(idx, operator, values)}
                />
              ))}
            </div>
            <div className="group-action-row">
              <Button
                text="Add Group Condition"
                type="button"
                onClick={handleCreate}
              />
              <Button
                text="Cancel"
                type="button"
                variant="outline"
                onClick={() => onRemove && onRemove(group.groupId)}
              />
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default EligibilityGroupForm;