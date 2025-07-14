import React from 'react';

const UpperArrow: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
    </svg>
);

export default UpperArrow;