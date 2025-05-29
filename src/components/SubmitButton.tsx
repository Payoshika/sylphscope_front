import React from "react";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  loadingText,
  defaultText,
  disabled = false,
}) => {
  return (
    <button
      type="submit"
      className="btn btn--full"
      disabled={isLoading || disabled}
    >
      {isLoading ? loadingText : defaultText}
    </button>
  );
};

export default SubmitButton;
