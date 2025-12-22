import React from 'react';

interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

const HRISIcon: React.FC<IconProps & { fillColor?: string }> = ({ size = 20, color = 'currentColor', strokeWidth = 2, fillColor = '#e0f2f1' }) => (
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
    <ellipse cx="12" cy="5" rx="9" ry="3" fill={fillColor} />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" fill={fillColor} />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

export default HRISIcon;
