import React from "react";

interface NumberInputProps {
  id: string;
  name: string;
  label: string;
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({ id, name, label, value, onChange }) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">{label}</label>
    <input
      type="number"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="input"
    />
  </div>
);

export default NumberInput;