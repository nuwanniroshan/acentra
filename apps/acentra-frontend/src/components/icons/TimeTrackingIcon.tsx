import React from 'react';

interface IconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

const TimeTrackingIcon: React.FC<IconProps & { fillColor?: string }> = ({ size = 20, color = 'currentColor', strokeWidth = 2, fillColor = '#e8f5e9' }) => (
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
    <circle cx="12" cy="12" r="10" fill={fillColor} />
    <polyline points="12 6 12 12 16 14" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeDasharray="4 4" />
  </svg>
);

export default TimeTrackingIcon;
