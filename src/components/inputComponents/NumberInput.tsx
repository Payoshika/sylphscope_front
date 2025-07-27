import React from "react";

interface NumberInputProps {
  id: string;
  name: string;
  label: string;
  value: number | "";
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  suffix?: string; 
}

const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
  const input = e.currentTarget;
  input.value = input.value.replace(/[^0-9.\-]/g, "");
};

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled,
  min,
  max,
  suffix, // <-- Add this prop
}) => (
  <div className="form-group number-input-group">
    <label htmlFor={id} className="form-label">{label}</label>
    <div className="number-input-wrapper">
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="input"
        step="any"
        min={min}
        max={max}
        onInput={handleInput}
      />
      {suffix && <span className="number-input-suffix">{suffix}</span>}
    </div>
  </div>
);

export default NumberInput;