import React, { useState } from "react";
import type { InputType, DataType, Option, ComparisonOperator } from "../../data/questionEligibilityInfoDto";
import Select from "../../components/inputComponents/Select";
import TextInput from "../../components/inputComponents/TextInput";
import Textarea from "../../components/inputComponents/Textarea";
import NumberInput from "../../components/inputComponents/NumberInput";
import Button from "../../components/basicComponents/Button";
import DatePicker from "../../components/inputComponents/datePickers/DatePicker";
import SearchableMultiSelect from "../../components/inputComponents/SearchableMultiSelect";
import type { DateValue } from "../../components/inputComponents/datePickers/types";
import CrossSign from "../../components/icons/CrossSign";

const inputTypeOptions: { value: InputType; label: string }[] = [
  { value: "TEXT", label: "Text" },
  { value: "TEXTAREA", label: "Text Area" },
  { value: "NUMBER", label: "Number" },
  { value: "DATE", label: "Date" },
  { value: "MULTISELECT", label: "Multi Select" },
  { value: "RADIO", label: "Radio" },
];

function getOperatorOptions(inputType: InputType) {
  switch (inputType) {
    case "TEXT":
    case "TEXTAREA":
      return [
        { value: "equals", label: "Equals" },
        { value: "contains", label: "Contains" },
      ];
    case "NUMBER":
      return [
        { value: "equals", label: "Equals" },
        { value: "not_equals", label: "Not Equals" },
        { value: "greater_than", label: "Greater Than" },
        { value: "less_than", label: "Less Than" },
        { value: "greater_than_or_equal", label: "Greater Than Or Equal" },
        { value: "less_than_or_equal", label: "Less Than Or Equal" },
      ];
    case "DATE":
      return [
        { value: "equals", label: "Equals" },
        { value: "not_equals", label: "Not Equals" },
        { value: "greater_than", label: "Greater Than" },
        { value: "less_than", label: "Less Than" },
        { value: "greater_than_or_equal", label: "Greater Than Or Equal" },
        { value: "less_than_or_equal", label: "Less Than Or Equal" },
      ];
    case "MULTISELECT":
    case "RADIO":
      return [
        { value: "equals", label: "Equals" },
        { value: "in_list", label: "In List" },
      ];
    default:
      return [];
  }
}

interface EligibilityFormBuilderProps {
  onCreate: (form: {
    question: {
      name: string;
      questionText: string;
      inputType: InputType;
      questionDataType: DataType;
    };
    operator: ComparisonOperator;
    options?: Option[];
    optionDataType?: DataType;
    values: any[];
  }) => void;
}

const EligibilityFormBuilder: React.FC<EligibilityFormBuilderProps> = ({ onCreate }) => {
  const [questionName, setQuestionName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [inputType, setInputType] = useState<InputType>("TEXT");
  const [dataType, setDataType] = useState<DataType>("STRING");
  const [operator, setOperator] = useState<ComparisonOperator>("equals");
  const [values, setValues] = useState<any[]>([""]);
  const [options, setOptions] = useState<Option[]>([]);
  const [optionInput, setOptionInput] = useState("");
  const [multiSelectError, setMultiSelectError] = useState<string>("");
  // Option handling for RADIO/MULTISELECT
  const handleAddOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, { label: optionInput, value: optionInput }]);
      setOptionInput("");
    }
  };
  const handleRemoveOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
    // Also remove from selected values if present
    setValues((prev) => prev.filter((v: string) => v !== options[idx].value));
  };

  // Value handling for condition values
const handleValueChange = (val: string | DateValue | number) => {
  setValues([val]);
};

const handleInputTypeChange = (newType: InputType) => {
  setInputType(newType);
  if (newType === "RADIO" || newType === "MULTISELECT") {
    setDataType("ARRAY");
  } else if (newType === "TEXT" || newType === "TEXTAREA") {
    setDataType("STRING");
  } else if (newType === "NUMBER") {
    setDataType("DOUBLE");
  } else if (newType === "DATE") {
    setDataType("DATE");
  } else {
    setDataType("STRING");
  }
};

  // For SearchableMultiSelect
    const handleMultiSelectChange = (selected: string[]) => {
    if (
        (inputType === "RADIO" || inputType === "MULTISELECT") &&
        operator === "equals" &&
        selected.length > 1
    ) {
        setMultiSelectError("You can only select one option when using 'Equals' operator.");
        setValues([]);
        return;
    }
    setMultiSelectError("");
    setValues(selected);
    };

  const searchableOptions = options.map(opt => ({
    value: opt.value,
    label: opt.label,
  }));

  const searchFunction = (query: string, opts: typeof searchableOptions) =>
    opts.filter(opt => opt.label.toLowerCase().includes(query.toLowerCase()));

  const handleCreate = () => {
    onCreate({
      question: {
        name: questionName,
        questionText,
        inputType,
        questionDataType: dataType,
      },
      operator,
      values,
      options: inputType === "RADIO" || inputType === "MULTISELECT" ? options : undefined,
    });
    setQuestionName("");
    setQuestionText("");
    setInputType("TEXT");
    setDataType("STRING");
    setOperator("equals");
    setValues([""]);
    setOptions([]);
    setOptionInput("");
    setMultiSelectError("");
  };

  return (
    <div className="eligibility-form-builder">
      <TextInput
        id="question-name"
        name="questionName"
        label="Question Name"
        value={questionName}
        onChange={(e) => setQuestionName(e.target.value)}
        required
      />
      <Textarea
        id="question-text"
        name="questionText"
        label="Question Text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
      <Select
        id="input-type"
        name="inputType"
        label="Input Type"
        value={inputType}
        onChange={(e) => handleInputTypeChange(e.target.value as InputType)}
        options={inputTypeOptions}
        required
      />
        {inputType !== "RADIO" && inputType !== "MULTISELECT" && (
        <Select
        id="operator"
        name="operator"
        label="Condition Operator"
        value={operator}
        onChange={(e) => setOperator(e.target.value as ComparisonOperator)}
        options={getOperatorOptions(inputType)}
        required
        />
        )}  
      {(inputType === "TEXT") && (
        <TextInput
          id="single-value"
          name="singleValue"
          label="Value"
          value={values[0] ?? ""}
          onChange={(e) => handleValueChange(e.target.value)}
        />
      )}
      {inputType === "NUMBER" && (
          <NumberInput
            id="number-value"
            name="numberValue"
            label="Value"
            value={values[0] ?? ""}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={false}
          />
      )}
      {inputType === "DATE" && (
        <DatePicker
          id="date-value"
          name="dateValue"
          label="Value"
          value={values[0] ?? ""}
          onChange={(val) => handleValueChange(val)}
        />
      )}
      {inputType === "TEXTAREA" && (
        <Textarea
          id="textarea-value"
          name="textareaValue"
          label="Value"
          value={values[0] ?? ""}
          onChange={(e) => handleValueChange(e.target.value)}
        />
      )}
      {/* Option builder and SearchableMultiSelect for RADIO/MULTISELECT */}
      {(inputType === "RADIO" || inputType === "MULTISELECT") && (
        <div>
          <form className="form-group">
            <ul>
              {options.map((opt, idx) => (
                <li key={idx} className="option-row">
                  <span>{opt.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="option-remove-btn"
                    aria-label={`Remove ${opt.label}`}
                  >
                    <CrossSign width={18} height={18} />
                  </button>
                </li>
              ))}
            </ul>
            <TextInput
              id="option-input"
              name="optionInput"
              label="Add Option"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
            />
            <Button text="Add Option" onClick={handleAddOption} type="button" />
          </form>
            <Select
            id="operator"
            name="operator"
            label="Condition Operator"
            value={operator}
            onChange={(e) => setOperator(e.target.value as ComparisonOperator)}
            options={getOperatorOptions(inputType)}
            required
            />
          <SearchableMultiSelect
            id="criteria-values"
            name="criteriaValues"
            label="Choose Criteria Value(s)"
            value={Array.isArray(values) ? values : values ? [values] : []}
            onChange={handleMultiSelectChange}
            options={searchableOptions}
            searchFunction={searchFunction}
            placeholder={
              inputType === "RADIO"
                ? "Select an option"
                : "Select one or more options"
            }
            required
            error={multiSelectError}
          />
        </div>
      )}
      <Button text="Create" onClick={handleCreate} type="button" />
    </div>
  );
};

export default EligibilityFormBuilder;