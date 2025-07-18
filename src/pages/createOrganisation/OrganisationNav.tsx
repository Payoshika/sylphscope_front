import React from "react";

interface OrganisationNavProps {
  steps: { key: string; label: string }[];
  currentStep: string;
  onStepChange: (stepKey: string) => void;
}

const OrganisationNav: React.FC<OrganisationNavProps> = ({ steps, currentStep, onStepChange }) => (
  <nav className="grant-nav">
    {steps.map((step) => (
      <button
        key={step.key}
        type="button"
        className={
          currentStep === step.key
            ? "grant-nav__item grant-nav__item--active"
            : "grant-nav__item"
        }
        onClick={() => onStepChange(step.key)}
        disabled={currentStep === step.key}
        style={currentStep === step.key ? { pointerEvents: "none" } : undefined}
      >
        <p>{step.label}</p>
      </button>
    ))}
  </nav>
);

export default OrganisationNav;