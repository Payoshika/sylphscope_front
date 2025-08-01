import React from "react";
import type { QuestionEligibilityInfoDto } from "../../data/questionEligibilityInfoDto";
import TextInput from "../../components/inputComponents/TextInput";
import Textarea from "../../components/inputComponents/Textarea";
import Select from "../../components/inputComponents/Select";
import NumberInput from "../../components/inputComponents/NumberInput";
import DatePicker from "../../components/inputComponents/datePickers/DatePicker";
import SearchableMultiSelect from "../../components/inputComponents/SearchableMultiSelect";
import CrossSign from "../../components/icons/CrossSign";
import type { SearchableOption } from "../../components/inputComponents/SearchableDropdown";

interface QuestionDisplayProps {
  question: QuestionEligibilityInfoDto;
  inputAllowed?: boolean;
  onRemove?: () => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  inputAllowed = false,
  onRemove,
}) => {
  const { question: q, options } = question;

  const renderInput = () => {
    switch (q.inputType) {
      case "TEXT":
        return (
          <TextInput
            id={`question-${q.id}`}
            name={q.name}
            label={q.questionText}
            value=""
            onChange={() => {}}
            disabled={!inputAllowed}
          />
        );
      case "TEXTAREA":
        return (
          <Textarea
            id={`question-${q.id}-textarea`}
            name={q.name}
            label={q.questionText}
            value=""
            onChange={() => {}}
            disabled={!inputAllowed}
          />
        );
      case "NUMBER":
        return (
          <NumberInput
            id={`question-${q.id}-number`}
            name={q.name}
            label={q.questionText}
            value=""
            onChange={() => {}}
            disabled={!inputAllowed}
          />
        );
      case "DATE":
        return (
          <DatePicker
            id={`question-${q.id}-date`}
            name={q.name}
            label={q.questionText}
            value={{ day: "", month: "", year: "" }}
            onChange={() => {}}
            disabled={!inputAllowed}
          />
        )
      case "RADIO":
        return (
          <Select
            id={`question-${q.id}-radio`}
            name={q.name}
            label={q.questionText}
            value=""
            onChange={() => {}}
            options={options.map(opt => ({ label: opt.label, value: opt.value }))}
            disabled={!inputAllowed}
          />
        );
      case "MULTISELECT":
        return (
          <SearchableMultiSelect
            id={`question-${q.id}-multiselect`}
            name={q.name}
            label={q.questionText}
            value={[]}
            onChange={() => { } }
            options={options.map(opt => ({ label: opt.label, value: opt.value }))}
            disabled={!inputAllowed} searchFunction={function (query: string, options: SearchableOption[]): SearchableOption[] {
              throw new Error("Function not implemented.");
            } }          />
        );
      default:
        return (
          <div>
            <strong>{q.name}</strong>
            <div>{q.questionText}</div>
            <div>Type: {q.inputType}</div>
            <div>Data Type: {q.questionDataType}</div>
          </div>
        );
    }
  };

  return (
    <div className="questions-view" style={{ position: "relative" }}>
      {onRemove && (
        <button
          type="button"
          className="question-remove-btn"
          onClick={onRemove}
          aria-label="Remove question"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            zIndex: 2,
          }}
        >
          <CrossSign width={22} height={22} />
        </button>
      )}
      {renderInput()}
      {!inputAllowed && (
        <div style={{ color: "#888", fontSize: "0.9rem" }}>
          (Preview only, cannot edit)
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;