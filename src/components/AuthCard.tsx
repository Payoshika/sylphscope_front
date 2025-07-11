import React from "react";

interface AuthCardProps {
  title: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <div className="signin-container signup-container">
      <div className="card">
        <div className="card__header">
          <h2>{title}</h2>
        </div>
        <div className="card__body">{children}</div>
        <div className="card__footer">
          <p className="text-center">
            {footerText}{" "}
            <a href={footerLinkTo} className="link">
              {footerLinkText}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
