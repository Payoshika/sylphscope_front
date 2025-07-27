import React from 'react';
/**
 * NOTE: The `student` and `provider` props are custom and not valid DOM attributes.
 * To prevent React from passing them to the underlying <svg> element (which causes
 * warnings like "Received `true` for a non-boolean attribute `student`"), we should
 * omit them before spreading props onto <svg>.
 *
 * This is handled by destructuring them out of props before passing the rest to <svg>.
 */

type PlusSignProps = React.SVGProps<SVGSVGElement> & { provider?: boolean; student?: boolean };
const PlusSign: React.FC<PlusSignProps> = ({ provider, student, ...svgProps }) => {
    let strokeColor = svgProps.stroke || "#3a3e46";
    if (provider) {
        strokeColor = "#578e7e";
    } else if (student) {
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
            style={{ minWidth: "2rem" }}
            {...svgProps}
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
};

export default PlusSign; 