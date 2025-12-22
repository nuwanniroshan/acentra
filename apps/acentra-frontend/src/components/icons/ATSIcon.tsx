import React from 'react';

interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

const ATSIcon: React.FC<IconProps & { fillColor?: string }> = ({ size = 20, color = 'currentColor', strokeWidth = 2, fillColor = '#e3f2fd' }) => (
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
    <circle cx="11" cy="11" r="8" fill={fillColor} />
    <path d="m21 21-4.3-4.3" />
    <path d="M11 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="white" />
    <path d="M7 16c0-2.2 1.8-4 4-4s4 1.8 4 4" />
  </svg>
);

export default ATSIcon;
