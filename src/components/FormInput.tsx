interface FormInputProps {
  id: string;
  name: string;
  type?: "text" | "email" | "password";
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
}) => {
  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {showPasswordToggle ? (
        <div className="input-group">
          <input
            type={inputType}
            id={id}
            name={name}
            className={`input ${error ? "input--error" : ""}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={onTogglePassword}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye slash icon (password visible - click to hide)
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="password-toggle__icon"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // Eye icon (password hidden - click to show)
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="password-toggle__icon"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            )}
          </button>
        </div>
      ) : (
        <input
          type={inputType}
          id={id}
          name={name}
          className={`input ${error ? "input--error" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FormInput;
