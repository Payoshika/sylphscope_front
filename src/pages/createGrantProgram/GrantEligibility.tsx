import Button from "../../components/basicComponents/Button";
import type { GrantProgram } from "../../types/grantProgram";
import { GrantStatus } from "../../types/grantProgram";
import { useNavigate, useOutletContext } from "react-router-dom";
import TitleAndHeadLine from "../../components/TitleAndHeadLine";
import { useState, useEffect} from "react";
import { updateEligibilityCriteria, fetchEligibilityQuestions,fetchEligibilityQuestionGroups, getEligibilityCriteria, createQuestion } from "../../services/GrantProgramService";
import type { ComparisonOperator, EligibilityGroupFormState,QuestionGroupEligibilityInfoDto,  QuestionEligibilityInfoDto, EligibilityCriteriaDTO, QuestionCondition, Question } from "../../data/questionEligibilityInfoDto";
import EligibilityGroupForm from "./EligibilityGroupForm";
import EligibilityFormBuilder from "./EligibilityFormBuilder";
import EligibilityForm from "./EligibilityForm";
import Modal from "../../components/basicComponents/Modal";
import type { ProviderStaff } from "../../types/user";
import { canEditGrant } from "../../utility/permissions";

interface GrantEligibilityProps {
  id: string;
  name: string;
  grantProgram: GrantProgram;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
  onGrantProgramChange: (updated: GrantProgram) => void;
  eligibilityQuestions: QuestionEligibilityInfoDto[];
  setEligibilityQuestions: React.Dispatch<React.SetStateAction<QuestionEligibilityInfoDto[]>>;
  eligibilityQuestionGroups: QuestionGroupEligibilityInfoDto[];
  setEligibilityQuestionGroups: React.Dispatch<React.SetStateAction<QuestionGroupEligibilityInfoDto[]>>;
  eligibilities: EligibilityCriteriaDTO[];
  setEligibilities: React.Dispatch<React.SetStateAction<EligibilityCriteriaDTO[]>>;
  error?: boolean | string;
  required?: boolean;
}

type EligibilityFormState = {
  criteria_id?: string; // Optional, can be null for new criteria
  form: QuestionEligibilityInfoDto;
  operator: ComparisonOperator;
  values: any[];
};

const GrantEligibility: React.FC<GrantEligibilityProps> = ({
  grantProgram,
  eligibilityQuestions, 
  setEligibilityQuestions,
  eligibilityQuestionGroups,
  setEligibilityQuestionGroups,
  setEligibilities,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibilityForms, setEligibilityForms] = useState<EligibilityFormState[]>([]);
  const [eligibilityGroupForms, setEligibilityGroupForms] = useState<EligibilityGroupFormState[]>([]);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  const navigate = useNavigate();
  const { providerStaff } = useOutletContext<{ providerStaff?: ProviderStaff }>();
  const isEditable = canEditGrant(providerStaff, grantProgram);
  const isReadOnly = !isEditable;

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (eligibilityQuestions.length > 0) {
      fetchEligibility();
    }
  }, [eligibilityQuestions, eligibilityQuestionGroups]);
  
    const fetchQuestions = async () => {
      try {
        const questions = await fetchEligibilityQuestions();
        setEligibilityQuestions(questions);
        console.log("Eligibility Questions:", questions);
        const questionGroups = await fetchEligibilityQuestionGroups();
        setEligibilityQuestionGroups(questionGroups);
        console.log("Eligibility Question Groups:", questionGroups);
      } catch (err) {
        console.error("Failed to fetch eligibility questions", err);
      } finally {
      }
    };

    const fetchEligibility = async () => {
    try {
        const eligibilityList = await getEligibilityCriteria(grantProgram.id);
        // You can set state here if you want to display the fetched criteria
        if (eligibilityList && Array.isArray(eligibilityList)) {
          setEligibilities(eligibilityList);
          const forms: EligibilityFormState[] = [];
          const groupForms: EligibilityGroupFormState[] = [];
          eligibilityList.forEach((criteria: EligibilityCriteriaDTO) => {
            if (criteria.criteriaType === "QUESTION_GROUP") {
              groupForms.push({
                groupId: criteria.questionGroupId ?? "",
                groupName: criteria.name,
                groupDescription: criteria.description || "",
                questionConditions: Array.isArray(criteria.questionConditions)
                  ? criteria.questionConditions.map(condition => ({
                      question: eligibilityQuestions.find(q => q.question.id === condition.questionId) || {
                        question: {
                          id: condition.questionId,
                          name: "",
                          questionText: "",
                          inputType: "TEXT",
                          questionDataType: "STRING",
                          description: "",
                          isRequired: false,
                        },
                        options: [],
                        operators: ["equals"]
                      },
                      condition
                    }))
                  : []
              });
            } else {
              const formState = convertToEligibilityFormState(criteria, eligibilityQuestions);
              if (formState) forms.push(formState);
            }
          });
          setEligibilityForms(forms);
          setEligibilityGroupForms(groupForms);
        }
    } catch (error) {
        console.error("Failed to fetch eligibility criteria", error);
    }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    
    setIsSubmitting(true);
      const criteriaList: EligibilityCriteriaDTO[] = [
    ...eligibilityForms.map(formState =>
      convertToEligibilityCriteriaDTO(formState, grantProgram.id)
    ),
    ...convertGroupFormsToCriteriaDTO(eligibilityGroupForms, grantProgram.id)
  ];
    try {
      await updateEligibilityCriteria(criteriaList, grantProgram.id);
      setEligibilities(criteriaList);
      setEligibilityForms([]);
      navigate("../questions");
    } catch (error) {
      console.error("Failed to update eligibility criteria", error);
    } finally {
      setIsSubmitting(false);
    }
  };


const createEligibility = (data: QuestionEligibilityInfoDto) => {
  if (isReadOnly) return;
  setEligibilityForms((prev) => [
    ...prev,
    {
      form: data,
      operator: data.operators[0],
      values: [],
    } as EligibilityFormState,
  ]);
};

const createEligibilityGroup = (group: QuestionGroupEligibilityInfoDto) => {
  if (isReadOnly) return;
  setEligibilityGroupForms((prev) => [
    ...prev,
    {
      groupId: group.id,
      groupName: group.name,
      groupDescription: group.description,
      questionConditions: group.questions.map(q => ({
        question: q,
        condition: {
          questionId: q.question.id ?? "",
          comparisonOperator: q.operators[0],
          values: [],
          valueDataType: q.question.questionDataType,
        }
      })),
    },
  ]);
};

const updateEligibilityGroupForm = (updatedGroup: EligibilityGroupFormState) => {
  if (isReadOnly) return;
  setEligibilityGroupForms(prev =>
    prev.map(group =>
      group.groupId === updatedGroup.groupId ? updatedGroup : group
    )
  );
  console.log("Updated eligibility group forms:", eligibilityGroupForms);
};

const duplicateEligibilityGroupForm = (groupId: string) => {
  if (isReadOnly) return;
  setEligibilityGroupForms(prev => {
    const groupToDuplicate = prev.find(g => g.groupId === groupId);
    if (!groupToDuplicate) return prev;
    // Create a new group with a unique id (or use a timestamp)
    const newGroup = {
      ...groupToDuplicate,
      groupId: `${groupToDuplicate.groupId}-${Date.now()}`,
      groupName: `${groupToDuplicate.groupName} (Copy)`,
      // Optionally reset conditions if needed
      questionConditions: groupToDuplicate.questionConditions.map(pair => ({
        question: pair.question,
        condition: { ...pair.condition }
      }))
    };
    // Insert the new group just below the original
    const idx = prev.findIndex(g => g.groupId === groupId);
    return [
      ...prev.slice(0, idx + 1),
      newGroup,
      ...prev.slice(idx + 1)
    ];
  });
};

const removeEligibilityForm = (index: number) => {
  if (isReadOnly) return;
  setEligibilityForms((prev) => prev.filter((_, i) => i !== index));
};

function convertToEligibilityCriteriaDTO(
  formState: EligibilityFormState,
  grantProgramId: string
): EligibilityCriteriaDTO {
  const question = formState.form.question;

  const simpleCondition: QuestionCondition = {
    questionId: question.id ?? "",
    description: question.description || "",
    comparisonOperator: formState.operator,
    values: formState.values,
    valueDataType: question.questionDataType,
  };

  return {
    id: formState.criteria_id || "", // Use existing ID if available
    grantProgramId,
    name: question.name,
    description: question.description || "",
    required: question.isRequired ?? false,
    criteriaType: "SINGLE",
    questionId: question.id,
    simpleCondition,
  };
}

const convertGroupFormsToCriteriaDTO = (
  eligibilityGroupForms: EligibilityGroupFormState[],
  grantProgramId: string
): EligibilityCriteriaDTO[] => {
  return eligibilityGroupForms.map(group => ({
    id: group.groupId,
    grantProgramId,
    name: group.groupName,
    description: group.groupDescription,
    required: true,
    criteriaType: "QUESTION_GROUP",
    questionGroupId: group.groupId,
    questionConditions: group.questionConditions.map(pair => pair.condition),
  }));
};

function convertToEligibilityFormState(
  criteria: EligibilityCriteriaDTO,
  questions: QuestionEligibilityInfoDto[]
): EligibilityFormState | null {
  // Find the matching question info by questionId
  const questionInfo = questions.find(q => q.question.id === criteria.questionId);
  if (!questionInfo || !criteria.simpleCondition) return null;

  return {
    form: questionInfo,
    criteria_id : criteria.id,
    operator: criteria.simpleCondition.comparisonOperator,
    values: criteria.simpleCondition.values,
  };
}

  return (
    <div className="content">
      <TitleAndHeadLine title="Create Eligibility Criteria" headline="Create Eligibility Criteria for the grant" provider={true} />
      
      {isReadOnly && (
        <div className="read-only-notice">
          <p>This grant program is currently in "{grantProgram.status}" status and cannot be modified.</p>
        </div>
      )}
      
    <form className={`form-group eligibility-lists ${isReadOnly ? 'form-group--readonly' : ''}`}>
    {eligibilityQuestions.map((eachData) => {
        const alreadyAdded = eligibilityForms.some(
        (form) => form.form.question.id === eachData.question.id
        );
        return (
        <Button
            key={eachData.question.id}
            text={eachData.question.name}
            onClick={() => createEligibility(eachData)}
            type="button"
            disabled={alreadyAdded || isReadOnly}
            variant={alreadyAdded ? "primary" : "outline"}
        />
        );
    })}
    {/* for eligibility question groups */}
      {eligibilityQuestionGroups.map((group) => {
    const alreadyAdded = eligibilityGroupForms.some(
      (form) => form.groupId === group.id
    );
    return (
      <Button
        key={group.id}
        text={group.name}
        onClick={() => createEligibilityGroup(group)}
        type="button"
        disabled={alreadyAdded || isReadOnly}
        variant={alreadyAdded ? "primary" : "outline"}
      />
    );
  })}
    </form>
    {eligibilityGroupForms.length > 0 && (
      <div className="eligibility-group-forms">
        {eligibilityGroupForms.map((groupForm) => (
          <EligibilityGroupForm
            key={groupForm.groupId}
            group={groupForm}
            onCreate={updateEligibilityGroupForm}
            onDuplicate={duplicateEligibilityGroupForm}
            onRemove={(groupId) =>
              setEligibilityGroupForms((prev) =>
                prev.filter((g) => g.groupId !== groupId)
              )
            }
            isReadOnly={isReadOnly}
            initialCollapsed={true}
            pending={groupForm.isPending}
          />
        ))}
      </div>
    )}
    {eligibilityForms.length >= 1 && (
        <div className="eligibility-forms">
            {eligibilityForms.map((formData, index) => (
                <EligibilityForm
                    key={index}
                    data={formData.form}
                    grantProgramId={grantProgram.id}
                    values={formData.values}
                    operator={formData.operator}
                    onRemove={() => removeEligibilityForm(index)}
                    onChange={(newOperator, newValues) => {
                      if (isReadOnly) return;
                      setEligibilityForms((prev) =>
                        prev.map((item, idx) =>
                          idx === index
                            ? { ...item, operator: newOperator, values: newValues }
                            : item
                        )
                      );
                    }}
                    isReadOnly={isReadOnly}
                />
            ))}
        </div>
    )}
    <Button
  text="Create Custom Condition"
  onClick={() => setShowBuilderModal(true)}
  type="button"
  disabled={isReadOnly}
/>

<Modal
  isOpen={showBuilderModal}
  onClose={() => setShowBuilderModal(false)}
  title="Create Custom Eligibility Condition"
>
<EligibilityFormBuilder
  onCreate={async (form) => {
    // Send question and options together
    const savedQuestion = await createQuestion(form.question as Question, form.options || []);
    if (!savedQuestion) {
      return;
    }
    const newQuestionEligibilityInfoDto: QuestionEligibilityInfoDto = {
      question: savedQuestion,
      options: form.options || [],
      operators: ["equals", "in_list"],
    };

    setEligibilityForms((prev) => [
      ...prev,
      {
        form: newQuestionEligibilityInfoDto,
        operator: form.operator,
        values: form.values,
      },
    ]);
    setShowBuilderModal(false);
  }}
/>
</Modal>
    <Button
        text={isSubmitting ? "Saving..." : "Save Eligibility"}
        disabled={isSubmitting || isReadOnly}
        onClick={handleSubmit}
    />
    </div>
  );
};

export default GrantEligibility;