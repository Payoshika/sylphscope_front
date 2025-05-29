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
            className="btn btn--ghost btn--small"
            onClick={onTogglePassword}
          >
            {showPassword ? "Hide" : "Show"}
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
