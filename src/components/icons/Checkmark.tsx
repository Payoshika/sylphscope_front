import React from "react";

interface CheckmarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const Checkmark: React.FC<CheckmarkProps> = ({
  size = 16,
  color = "currentColor",
  strokeWidth = 2.5,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`checkmark-icon ${className}`}
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

export default Checkmark;
