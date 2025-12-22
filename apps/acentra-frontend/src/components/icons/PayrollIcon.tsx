import React from 'react';

interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

const PayrollIcon: React.FC<IconProps & { fillColor?: string }> = ({ size = 20, color = 'currentColor', strokeWidth = 2, fillColor = '#fff3e0' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="12" x="2" y="6" rx="2" fill={fillColor} />
    <path d="M12 2v20" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    <circle cx="12" cy="12" r="2" fill="white" />
  </svg>
);

export default PayrollIcon;
