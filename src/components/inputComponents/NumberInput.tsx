import React from "react";

interface NumberInputProps {
  id: string;
  name?: string;
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  suffix?: string; 
}

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled,
  min,
  max,
  suffix,
}) => {
  // show empty string when value is empty so user can delete the 0
  const displayValue = value === "" ? "" : String(value);

  return (
    <div className="form-group number-input-group">
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <div className="number-input-wrapper" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          type="number"
          id={id}
          name={name}
          value={displayValue}
          onChange={onChange}
          disabled={disabled}
          className="input"
          step="any"
          min={min}
          max={max}
        />
        {suffix && (
          <span className="number-input-suffix" aria-hidden style={{ fontWeight: 600 }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default NumberInput;