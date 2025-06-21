// src/components/icons/EyeIcon.tsx
import React from "react";

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

const EyeIcon: React.FC<IconProps> = ({
  width = 20,
  height = 20,
  className = "",
  color = "currentColor",
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default EyeIcon;
