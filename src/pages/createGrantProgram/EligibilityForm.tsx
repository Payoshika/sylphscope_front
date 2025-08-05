import React from "react";
import type { QuestionEligibilityInfoDto, ComparisonOperator } from "../../data/questionEligibilityInfoDto";
import DatePicker from "../../components/inputComponents/datePickers/DatePicker";
import Select from "../../components/inputComponents/Select";
import TextInput from "../../components/inputComponents/TextInput";
import Textarea from "../../components/inputComponents/Textarea";
import CrossSign from "../../components/icons/CrossSign";
import SearchableMultiSelect from "../../components/inputComponents/SearchableMultiSelect";
import NumberInput from "../../components/inputComponents/NumberInput";
import type { SearchableDropdownProps, SearchableOption } from "../../components/inputComponents/SearchableDropdown";

interface EligibilityFormProps {
  data: QuestionEligibilityInfoDto;
  grantProgramId: string;
  operator: ComparisonOperator;
  values: any[];
  onChange: (operator: ComparisonOperator, values: any[]) => void;
  onRemove?: () => void; 
}

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  data,
  operator,
  values,
  onChange,
  onRemove,
}) => {
  const { question, options = [], operators } = data;
  const [multiSelectError, setMultiSelectError] = React.useState<string>("");

  // Only build searchableOptions if options exist and are non-empty
  const searchableOptions: SearchableOption[] =
    Array.isArray(options) && options.length > 0
      ? options.map(opt => ({
          value: opt.value,
          label: opt.label,
        }))
      : [];

  const searchFunction: SearchableDropdownProps["searchFunction"] = (query, options) =>
    options.filter(opt =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    );

  // Handle value change for different input types
const handleValueChange = (e: any) => {
  // If e.target exists, it's a normal event
  if (e && e.target) {
    if (question.inputType === "NUMBER") {
      onChange(operator, [e.target.valueAsNumber ?? ""]);
    } else if (question.inputType === "RADIO") {
      onChange(operator, [e.target.value]);
    } else if (question.inputType === "MULTISELECT") {
      onChange(operator, Array.isArray(e) ? e.map((v) => v.value) : []);
    } else {
      onChange(operator, [e.target.value]);
    }
  } else {
    // Otherwise, it's a direct value (e.g., from DatePicker)
    onChange(operator, [e ?? ""]);
  }
};

const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newOperator = e.target.value as ComparisonOperator;
  if (newOperator === "equals" && Array.isArray(values) && values.length > 1) {
    setMultiSelectError("You can only select one option for this condition.");
    onChange(newOperator, []);
    return;
  }
  setMultiSelectError("");
  onChange(newOperator, values);
};

  const handleMultiSelectChange = (val: any) => {
    // If operator is "equals", only allow one selection
    if (operator === "equals") {
      if (Array.isArray(val) && val.length > 1) {
        setMultiSelectError("You can only select one option for this condition.");
        onChange(operator, []);
        return;
      }
      setMultiSelectError("");
      onChange(operator, Array.isArray(val) ? val : []);
    } else {
      // For "in_list" and other operators, allow multiple selections
      setMultiSelectError("");
      onChange(operator, Array.isArray(val) ? val : []);
    }
  };

  return (
    <div className="eligibility-form">
      {onRemove && (  
        <button
          type="button"
          className="eligibility-form__remove-btn"
          onClick={onRemove}
          aria-label="Remove eligibility form"
        >
          <CrossSign width={22} height={22} />
        </button>
      )}
      <div>
        <p className="form-label">{question.questionText}</p>
      </div>
      <div className="comparison-and-values-options">
        <div>
          <Select
            id={`${question.id}-operator`}
            name={`${question.name}-operator`}
            value={operator}
            onChange={handleOperatorChange}
            options={operators.map(op => ({ label: op, value: op }))}
            placeholder="Select operator"
            label="Condition"
            required
          />
        </div>
        <div>
          {question.inputType === "NUMBER" && (
            <NumberInput
              id="customNumberInput"
              name={question.name}
              label={question.questionText}
              value={values[0] ?? ""}
              onChange={handleValueChange}
              disabled={false}
            />
          )}
          {question.inputType === "DATE" && (
            <DatePicker
              id="customDateInput"
              name={question.name}
              label={question.questionText}
              value={values[0] ?? ""}
              onChange={handleValueChange}
            />
          )}
          {(question.inputType === "RADIO" || question.inputType === "MULTISELECT") && searchableOptions.length > 0 && (
            <SearchableMultiSelect
              id="customMultiSelectInput"
              name={question.name}
              label={question.questionText}
              value={Array.isArray(values) ? values : values ? [values] : []}
              onChange={handleMultiSelectChange}
              options={searchableOptions}
              searchFunction={searchFunction}
              placeholder={
                question.inputType === "RADIO"
                  ? "Select an option"
                  : "Select one or more options"
              }
              required={question.isRequired}
              error={multiSelectError}
            />
          )}
          {question.inputType === "TEXT" && (
            <TextInput
              id="customTextInput"
              name={question.name}
              label={question.questionText}
              value={values[0] ?? ""}
              onChange={handleValueChange}
              required={question.isRequired}
            />
          )}
          {question.inputType === "TEXTAREA" && (
            <Textarea
              id="customTextareaInput"
              name={question.name}
              label={question.questionText}
              value={values[0] ?? ""}
              onChange={(e) => handleValueChange(e)}
              required={question.isRequired}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityForm;