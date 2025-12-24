import React from 'react';
import { Badge } from '@mui/material';
import type { BadgeProps } from '@mui/material';

export type AuroraBadgeProps = BadgeProps;

/**
 * AuroraBadge
 * 
 * A wrapper around MUI's Badge component (notification dot/count).
 */
export const AuroraBadge: React.FC<AuroraBadgeProps> = (props) => {
  return <Badge {...props} />;
};