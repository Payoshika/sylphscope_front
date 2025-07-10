import React from "react";
import type { QuestionEligibilityInfoDto, ComparisonOperator } from "../../data/questionEligibilityInfoDto";
import DatePicker from "../../components/inputComponents/datePickers/DatePicker";
import Select from "../../components/inputComponents/Select";
import CrossSign from "../../components/icons/CrossSign";
import SearchableDropdown, {
    type SearchableOption,
    type SearchableDropdownProps,
} from "../../components/inputComponents/SearchableDropdown";
import SearchableMultiSelect from "../../components/inputComponents/SearchableMultiSelect";
import NumberInput from "../../components/inputComponents/NumberInput";

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
  grantProgramId,
  operator,
  values,
  onChange,
  onRemove,
}) => {
  const { question, options = [], operators } = data;

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
    if (question.inputType === "NUMBER") {
      onChange(operator, [e.target.valueAsNumber ?? ""]);
    } else if (question.inputType === "RADIO") {
      onChange(operator, [e.target.value]);
    } else if (question.inputType === "MULTISELECT") {
      onChange(operator, Array.isArray(e) ? e.map((v) => v.value) : []);
    } else {
      onChange(operator, [e.target.value]);
    }
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as ComparisonOperator, values);
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
          <CrossSign width={30} height={30} />
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
              id={question.id}
              name={question.name}
              label={question.questionText}
              value={values[0] ?? ""}
              onChange={handleValueChange}
            />
          )}
          {question.inputType === "DATE" && (
            <DatePicker
              id={question.id}
              name={question.name}
              label={question.questionText}
              value={values[0] ?? ""}
              onChange={handleValueChange}
            />
          )}
          {(question.inputType === "RADIO" || question.inputType === "MULTISELECT") && searchableOptions.length > 0 && (
            <SearchableMultiSelect
              id={question.id}
              name={question.name}
              label={question.questionText}
              value={question.inputType === "MULTISELECT" ? values : values[0] ?? ""}
              onChange={(val: any) => {
                if (question.inputType === "MULTISELECT") {
                  onChange(operator, Array.isArray(val) ? val : []);
                } else {
                  onChange(operator, [val]);
                }
              }}
              options={searchableOptions}
              searchFunction={searchFunction}
              placeholder={
                question.inputType === "RADIO"
                  ? "Select an option"
                  : "Select one or more options"
              }
              required={question.isRequired}
            />
          )}
          {question.inputType === "TEXT" && (
            <input
              id={question.id}
              name={question.name}
              type="text"
              className="input"
              value={values[0] ?? ""}
              onChange={handleValueChange}
              required={question.isRequired}
            />
          )}
          {question.inputType === "TEXTAREA" && (
            <textarea
              id={question.id}
              name={question.name}
              className="input"
              value={values[0] ?? ""}
              onChange={handleValueChange}
              required={question.isRequired}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityForm;