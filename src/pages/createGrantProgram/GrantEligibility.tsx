import Button from "../../components/basicComponents/Button";
import type { GrantProgram } from "../../types/grantProgram";
import { useNavigate } from "react-router-dom";
import TitleAndHeadLine from "./TitleAndHeadLine";
import { useState, useEffect, type FormEvent } from "react";
import { updateEligibilityCriteria, createEligibilityCriteria, fetchEligibilityQuestions, getEligibilityCriteria, createQuestion } from "../../services/GrantProgramService";
import type { ComparisonOperator, QuestionEligibilityInfoDto, EligibilityCriteriaDTO, QuestionCondition, Option, InputType, DataType } from "../../data/questionEligibilityInfoDto";
import EligibilityFormBuilder from "./EligibilityFormBuilder";
import EligibilityForm from "./EligibilityForm";
import Modal from "../../components/basicComponents/Modal";

interface GrantEligibilityProps {
  id: string;
  name: string;
  grantProgram: GrantProgram;
  onUpdateGrant: (id: string, grantProgram: GrantProgram) => Promise<any>;
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
  id,
  name,
  grantProgram,
  onUpdateGrant,
  error = false,
  required = true,
}) => {
    const [eligibilityQuestions, setEligibilityQuestions] = useState<QuestionEligibilityInfoDto[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [eligibilityForms, setEligibilityForms] = useState<EligibilityFormState[]>([]);  
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (eligibilityQuestions.length > 0) {
      fetchEligibility();
    }
  }, [eligibilityQuestions]);
  
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const questions = await fetchEligibilityQuestions();
        setEligibilityQuestions(questions);
        setSubmitSuccess("Eligibility questions fetched successfully.");
        console.log("Eligibility Questions:", eligibilityQuestions);
      } catch (err) {
        console.error("Failed to fetch eligibility questions", err);
      } finally {
        setLoadingQuestions(false);
      }
    };

    const fetchEligibility = async () => {
    try {
        const grantProgramId = "686cf160f9b36c21721c30d8";
        const eligibilityList = await getEligibilityCriteria(grantProgramId);
        console.log("Fetched eligibility criteria:", eligibilityList);
        // You can set state here if you want to display the fetched criteria
        if (eligibilityList && Array.isArray(eligibilityList)) {
            const forms = eligibilityList
                .map((criteria: EligibilityCriteriaDTO) =>
                    convertToEligibilityFormState(criteria, eligibilityQuestions)
                )
                .filter((formState): formState is EligibilityFormState => formState !== null);
            setEligibilityForms(forms);
        }
    } catch (error) {
        console.error("Failed to fetch eligibility criteria", error);
    }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const criteriaList: EligibilityCriteriaDTO[] = eligibilityForms.map(formState =>
        // just for now, set the tentative grantprogramID
    convertToEligibilityCriteriaDTO(formState, grantProgram.id || "686cf160f9b36c21721c30d8")
    );
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    console.log("sending criteria list");
    console.log(criteriaList);
    try {
      await updateEligibilityCriteria(criteriaList, grantProgram.id || "686cf160f9b36c21721c30d8");
      setSubmitSuccess("Eligibility criteria updated successfully.");
      setEligibilityForms([]);
    } catch (error) {
      console.error("Failed to update eligibility criteria", error);
      setSubmitError("Failed to update eligibility criteria");
    } finally {
      setIsSubmitting(false);
    }
  };


const createEligibility = (data: QuestionEligibilityInfoDto) => {
  setEligibilityForms((prev) => [
    ...prev,
    {
      form: data,
      operator: data.operators[0],
      values: [],
    } as EligibilityFormState,
  ]);
};

const removeEligibilityForm = (index: number) => {
  setEligibilityForms((prev) => prev.filter((_, i) => i !== index));
};

function convertToEligibilityCriteriaDTO(
  formState: EligibilityFormState,
  grantProgramId: string
): EligibilityCriteriaDTO {
  const question = formState.form.question;

  const simpleCondition: QuestionCondition = {
    questionId: question.id,
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

const handleCreateEligibilityForm = (form: {
  inputType: InputType;
  dataType: string;
  values: any[];
  options?: Option[];
}) => {
  // Create a new QuestionEligibilityInfoDto for the builder form
  const newQuestion: QuestionEligibilityInfoDto = {
    question: {
      id: "",
      name: "Custom Question",
      inputType: form.inputType,
      questionDataType: form.dataType,
      questionText: "Custom Question",
      description: "",
      isRequired: false,
    },
    options: form.options || [],
    operators: [],
  };

  setEligibilityForms((prev) => [
    ...prev,
    {
      form: newQuestion,
      operator: "equals",
      values: form.values,
    },
  ]);
};

  return (
    <div className="content">
      <TitleAndHeadLine title="Create Eligibility Criteria" headline="Create Eligibility Criteria for the grant" provider={true} />
    <form className="form-group eligibility-lists">
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
            disabled={alreadyAdded}
            variant={alreadyAdded ? "primary" : "outline"}
        />
        );
    })}
    </form>
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
                    setEligibilityForms((prev) =>
                    prev.map((item, idx) =>
                        idx === index
                        ? { ...item, operator: newOperator, values: newValues }
                        : item
                    )
                    );
                }}
                />
            ))}
        </div>
    )}
    <Button
  text="Create Custom Condition"
  onClick={() => setShowBuilderModal(true)}
  type="button"
/>

<Modal
  isOpen={showBuilderModal}
  onClose={() => setShowBuilderModal(false)}
  title="Create Custom Eligibility Condition"
>
<EligibilityFormBuilder
  onCreate={async (form) => {
    // Send question and options together
    const savedQuestion = await createQuestion(form.question, form.options || []);
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
        disabled={isSubmitting}
        onClick={handleSubmit}
    />
    </div>
  );
};

export default GrantEligibility;