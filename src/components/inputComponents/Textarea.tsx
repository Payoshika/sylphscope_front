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
      />
    </div>
  );
};

export default Textarea;
