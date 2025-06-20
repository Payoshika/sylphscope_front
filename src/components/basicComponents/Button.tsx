import React from "react";

interface ButtonProps {
  text: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "small" | "regular" | "large";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  size = "regular",
  disabled = false,
  fullWidth = false,
  onClick,
}) => {
  const getButtonClass = () => {
    let baseClass = "btn";

    if (variant === "outline") baseClass += " btn--outline";
    if (variant === "ghost") baseClass += " btn--ghost";
    if (size === "small") baseClass += " btn--small";
    if (size === "large") baseClass += " btn--large";
    if (fullWidth) baseClass += " btn--full";

    return baseClass;
  };

  return (
    <button className={getButtonClass()} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
