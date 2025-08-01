import React from 'react';

interface FigorousLogoProps extends React.SVGProps<SVGSVGElement> {
  role?: string;
}

const FigorousLogo: React.FC<FigorousLogoProps> = ({
  role="student",
  ...props
}) => {
  const studentColor = '#3674b5';
  const providerColor = '#578e7e';
  const fillColor = role === 'provider' ? providerColor : studentColor;

  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <rect
        x={2}
        y={2}
        width={44}
        height={44}
        rx={8}
        fill={fillColor}
      />
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Inter, Helvetica, Arial, sans-serif"
        fontWeight="bold"
        fontSize="24"
        fill="#fff"
        letterSpacing="1"
      >
        F
      </text>
    </svg>
  );
};

export default FigorousLogo;
