import React from 'react';

const OrganisationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Roof */}
    <polygon points="12 4 4 10 20 10 12 4" fill="none" stroke="currentColor" />
    {/* Body */}
    <rect x="6" y="10" width="12" height="8" rx="2" fill="none" stroke="currentColor" />
    {/* Door */}
    <rect x="11" y="14" width="2" height="4" rx="0.5" fill="none" stroke="currentColor" />
  </svg>
);

export default OrganisationIcon;
