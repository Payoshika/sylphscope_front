import TextInput from "../components/inputComponents/TextInput";
import NumberInput from "../components/inputComponents/NumberInput";
import Textarea from "../components/inputComponents/Textarea";
import Select from "../components/inputComponents/Select";
import SearchableMultiSelect from "../components/inputComponents/SearchableMultiSelect";
import DatePicker from "../components/inputComponents/datePickers/DatePicker";
import { toDateValue } from "../components/inputComponents/datePickers/utils";
import type { SearchableOption } from "../components/inputComponents/SearchableDropdown";

const defaultSearchFunction = (query: string, options: SearchableOption[]) => {
  return options.filter(opt =>
    opt.label.toLowerCase().includes(query.toLowerCase())
  );
};


export function renderInput(question: any, options: any, value: any, onChange: (id: string, value: any) => void) {
  const inputType = question.inputType;
  const id = question.id || question.name;
  switch (inputType) {
    case "TEXT":
      return (
        <TextInput
          id={id}
          name={id}
          label={question.questionText}
          value={value ?? ""}
          onChange={(e) => onChange(id, e.target.value)}
          required={question.isRequired}
        />
      );
    case "TEXTAREA":
      return (
        <Textarea
          id={id}
          name={id}
          label={question.questionText}
          value={value ?? ""}
          onChange={(e) => onChange(id, e.target.value)}
          required={question.isRequired}
        />
      );
    case "NUMBER":
      return (
        <NumberInput
        id={id}
        name={id}
        label={question.questionText}
        value={value !== undefined && value !== null ? value : ""}
        onChange={(e) => onChange(id, e.target.value === "" ? "" : Number(e.target.value))}
        disabled={false}
        />
      );
    case "DATE":
      return (
        <DatePicker
          id={id}
          name={id}
          label={question.questionText}
          value={toDateValue(value)}
          onChange={(val) => onChange(id, val)}
        />
      );
    case "RADIO":
      return (
        <Select
          id={id}
          name={id}
          label={question.questionText}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          options={options.map((opt: any) => ({
            value: opt.value,
            label: opt.label,
          }))}
        />
      );
    case "MULTISELECT":
      return (
        <SearchableMultiSelect
          id={id}
          name={id}
          label={question.questionText}
          value={Array.isArray(value) ? value : []}
          onChange={(vals) => onChange(id, vals)}
          options={options.map((opt: any) => ({
            value: opt.value,
            label: opt.label,
          }))}
          searchFunction={defaultSearchFunction}
        />
      );
    default:
      return (
        <div>
          <strong>{question.name}</strong>
          <div>{question.questionText}</div>
          <div>Type: {question.inputType}</div>
          <div>Data Type: {question.questionDataType}</div>
        </div>
      );
  }
}
