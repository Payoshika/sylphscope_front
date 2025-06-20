import React from "react";

interface BadgeProps {
  text: string;
  variant?: "default" | "outline";
  size?: "small" | "regular" | "large";
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = "default",
  size = "regular",
}) => {
  const getBadgeClass = () => {
    let baseClass = "badge";
    if (variant === "outline") baseClass += " badge--outline";
    if (size === "small") baseClass += " badge--small";
    if (size === "large") baseClass += " badge--large";
    return baseClass;
  };

  return <span className={getBadgeClass()}>{text}</span>;
};

export default Badge;
