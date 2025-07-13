import React from "react";

interface NumberInputProps {
  id: string;
  name: string;
  label: string;
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  // Remove any non-numeric characters except for . and -
  input.value = input.value.replace(/[^0-9.\-]/g, "");
};

const NumberInput: React.FC<NumberInputProps> = ({ id, name, label, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">{label}</label>
    <input
      type="number"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onInput={handleInput}
      className="input"
      step="any"
    />
  </div>
);

export default NumberInput;