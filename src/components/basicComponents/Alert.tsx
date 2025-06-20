import React from "react";

interface AlertProps {
  title?: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

const Alert: React.FC<AlertProps> = ({ title, message, type = "info" }) => {
  return (
    <div className={`alert ${type ? `alert--${type}` : ""}`}>
      {title && <div className="alert__title">{title}</div>}
      <div className="alert__message">{message}</div>
    </div>
  );
};

export default Alert;
