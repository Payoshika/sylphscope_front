import React from "react";

interface AlertProps {
  message: string;
  type?: "error" | "success" | "warning" | "info";
}

const Alert: React.FC<AlertProps> = ({ message, type = "error" }) => {
  return (
    <div className={`alert alert--${type}`}>
      <div className="alert__message">{message}</div>
    </div>
  );
};

export default Alert;
