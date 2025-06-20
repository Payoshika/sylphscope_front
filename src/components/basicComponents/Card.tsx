import React from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, footer }) => {
  return (
    <div className="card">
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h4>{title}</h4>}
          {subtitle && <p className="caption">{subtitle}</p>}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
};

export default Card;
