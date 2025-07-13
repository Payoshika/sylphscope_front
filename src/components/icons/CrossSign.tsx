import React from 'react';

const CrossSign: React.FC<
    React.SVGProps<SVGSVGElement> & { provider?: boolean; student?: boolean }
> = (props) => {
    let strokeColor = props.stroke || "#3a3e46";
    if (props.provider) {
        strokeColor = "#578e7e";
    } else if (props.student) {
        strokeColor = "#3674b5";
    }

    return (
        <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={strokeColor}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: "rotate(45deg)" }}
            {...props}
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
};

export default CrossSign;