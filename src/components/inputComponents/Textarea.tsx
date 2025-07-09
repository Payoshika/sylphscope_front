import React from "react";

interface TextareaProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  rows?: number;
  required?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  rows = 4,
  required = false,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        className="textarea"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        required={required}
      />
    </div>
  );
};

export default Textarea;
