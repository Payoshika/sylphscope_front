import React from "react";

interface RadioProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label className="radio">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="radiomark"></span>
      {label}
    </label>
  );
};

export default Radio;
