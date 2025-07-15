import React, { useState } from "react";
import type { InputType, DataType, Option } from "../../data/questionEligibilityInfoDto";
import TextInput from "../../components/inputComponents/TextInput";
import Textarea from "../../components/inputComponents/Textarea";
import Select from "../../components/inputComponents/Select";
import Button from "../../components/basicComponents/Button";

const inputTypeOptions: { value: InputType; label: string }[] = [
  { value: "TEXT", label: "Text" },
  { value: "TEXTAREA", label: "Text Area" },
  { value: "NUMBER", label: "Number" },
  { value: "DATE", label: "Date" },
  { value: "MULTISELECT", label: "Multi Select" },
  { value: "RADIO", label: "Radio" },
];

const dataTypeOptions: { value: DataType; label: string }[] = [

  { value: "STRING", label: "String" },
  { value: "INTEGER", label: "Integer" },
  { value: "DOUBLE", label: "Double" },
  { value: "DATE", label: "Date" },
  { value: "DATETIME", label: "Datetime" },
];

interface QuestionFormProps {
  onCreate: (question: {
    name: string;
    questionText: string;
    inputType: InputType;
    questionDataType: DataType;
    options?: Option[];
  }) => void;
}

function getDataTypeOptions(inputType: InputType) {
  switch (inputType) {
    case "TEXT":
    case "TEXTAREA":
      return "STRING";
    case "NUMBER":
      return "DOUBLE";
    case "MULTISELECT":
    case "RADIO":
      return "ARRAY";
    default:
      return "STRING";
  }
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [inputType, setInputType] = useState<InputType>("TEXT");
  const [dataType, setDataType] = useState<DataType>("STRING");
  const [options, setOptions] = useState<Option[]>([]);
  const [optionInput, setOptionInput] = useState("");

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, { label: optionInput, value: optionInput }]);
      setOptionInput("");
    }
  };

  const handleRemoveOption = (idx: number) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const handleCreate = () => {
    onCreate({
      name,
      questionText,
      inputType,
      questionDataType: dataType,
      options: inputType === "RADIO" || inputType === "MULTISELECT" ? options : undefined,
    });
    setName("");
    setQuestionText("");
    setInputType("TEXT");
    setDataType("STRING");
    setOptions([]);
    setOptionInput("");
  };

  const handleInputTypeChange = (newType: InputType) => {
    setInputType(newType);
    const option = getDataTypeOptions(newType);
    setDataType(option ? option : "STRING");
  };

  return (
    <div className="question-form">
      <TextInput
        id="question-name"
        name="questionName"
        label="Question Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      {(inputType === "RADIO" || inputType === "MULTISELECT") && (
        <div>
          <form className="form-group">
            <ul>
              {options.map((opt, idx) => (
                <li key={idx}>
                  <span>{opt.label}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    aria-label={`Remove ${opt.label}`}
                  >
                    ×
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
        </div>
      )}
      <Button text="Create" onClick={handleCreate} type="button" />
    </div>
  );
};

export default QuestionForm;