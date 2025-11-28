import React from 'react';
import { Chip, Badge } from '@mui/material';
import type { ChipProps, BadgeProps } from '@mui/material';

export interface AuroraChipProps extends ChipProps {}
export interface AuroraBadgeProps extends BadgeProps {}

/**
 * AuroraChip
 * 
 * A wrapper around MUI's Chip component.
 */
export const AuroraChip: React.FC<AuroraChipProps> = (props) => {
  return <Chip {...props} />;
};

/**
 * AuroraBadge
 * 
 * A wrapper around MUI's Badge component (notification dot/count).
 */
export const AuroraBadge: React.FC<AuroraBadgeProps> = (props) => {
  return <Badge {...props} />;
};