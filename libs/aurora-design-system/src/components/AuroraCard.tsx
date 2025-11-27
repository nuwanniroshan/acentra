import React from 'react';
import { Card, CardProps, CardContent } from '@mui/material';

export interface AuroraCardProps extends CardProps {
  noPadding?: boolean;
}

/**
 * AuroraCard
 * 
 * A wrapper around MUI's Card component.
 * automatically includes CardContent unless noPadding is specified.
 */
export const AuroraCard: React.FC<AuroraCardProps> = ({ children, noPadding = false, ...props }) => {
  return (
    <Card {...props}>
      {noPadding ? children : <CardContent>{children}</CardContent>}
    </Card>
  );
};