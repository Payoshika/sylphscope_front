import React, { useEffect, useState } from "react";
import { useToast, type Toast } from "../contexts/ToastContext";

interface ToastItemProps {
  toast: Toast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300); // Match animation duration
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "";
    }
  };

  return (
    <div
      className={`toast toast--${toast.type} ${
        isVisible ? "toast--visible" : ""
      } ${isExiting ? "toast--exiting" : ""}`}
    >
      <div className="toast__content">
        <div className="toast__icon">{getToastIcon()}</div>
        <div className="toast__body">
          {toast.title && <div className="toast__title">{toast.title}</div>}
          <div className="toast__message">{toast.message}</div>
        </div>
        <button
          className="toast__close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
