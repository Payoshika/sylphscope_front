import React, { useRef, useEffect } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    onChange(e as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        className="textarea"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onInput={handleInput}
        disabled={disabled}
        rows={rows}
        required={required}
        style={{ resize: "vertical", overflow: "hidden" }}
      />
    </div>
  );
};

export default Textarea;