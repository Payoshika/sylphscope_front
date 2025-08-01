import React from 'react';

const MessageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="6" width="16" height="12" rx="1.5" />
    <polyline points="4 7 12 12.5 20 7" />
  </svg>
);

export default MessageIcon;
