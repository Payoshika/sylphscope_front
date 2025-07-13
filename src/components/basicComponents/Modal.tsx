import React from "react";
import CrossSign from "../icons/CrossSign";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal__content">
        {title && (
          <div className="modal__header">
            <h3>{title}</h3>
            <button
              className="modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <CrossSign width={24} height={24} />
            </button>
          </div>
        )}
        <div className="modal__body">{children}</div>
        {actions && <div className="modal__footer">{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;
