import React, { useState } from "react";
import type { EligibilityGroupFormState, ComparisonOperator, QuestionConditionPair } from "../../data/questionEligibilityInfoDto";
import TextInput from "../../components/inputComponents/TextInput";
import Button from "../../components/basicComponents/Button";
import EligibilityForm from "./EligibilityForm";

interface EligibilityGroupFormProps {
  group: EligibilityGroupFormState;
  onCreate: (group: EligibilityGroupFormState) => void;
  onUpdateCondition?: (groupId: string, idx: number, condition: QuestionConditionPair) => void;
  onDuplicate?: (groupId: string) => void;
  initialCollapsed?: boolean;
  pending?: boolean;
}

const EligibilityGroupForm: React.FC<EligibilityGroupFormProps> = ({ group, onCreate, onUpdateCondition, onDuplicate, initialCollapsed = false, pending = true }) => {
  const [groupName, setGroupName] = useState(group.groupName);
  const [questionConditions, setQuestionConditions] = useState<QuestionConditionPair[]>(group.questionConditions);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [pendingStatus, setPendingStatus] = useState(pending);

  const handleConditionChange = (idx: number, operator: ComparisonOperator, values: any[]) => {
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
        <div>
          {collapsed ? (
            <div className="group-collapsed-row">
                <button
                type="button"
                className="group-name-collapsed"
                onClick={() => setCollapsed(false)}
                >
                {groupName}
                </button>
                <button
                type="button"
                className="group-duplicate-btn"
                onClick={() => onDuplicate && onDuplicate(group.groupId)}
                >
                Create different condition for the same question group
                </button>
            </div>
            ) : (
            <TextInput
              id={`group-name-${group.groupId}`}
              name={`groupName-${group.groupId}`}
              label="Custom Condition Name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              required
            />
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
            <Button
              text="Add Group Condition"
              type="button"
              className="add-group-condition-btn"
              onClick={handleCreate}
            />
          </>
        )}
      </form>
    </div>
  );
};

export default EligibilityGroupForm;