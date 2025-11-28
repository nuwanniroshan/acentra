import React from 'react';
import { Card, CardContent, CardActions, CardHeader, CardMedia } from '@mui/material';
import type { CardProps, CardContentProps, CardActionsProps, CardHeaderProps, CardMediaProps } from '@mui/material';

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

export const AuroraCardContent: React.FC<CardContentProps> = (props) => <CardContent {...props} />;
export const AuroraCardActions: React.FC<CardActionsProps> = (props) => <CardActions {...props} />;
export const AuroraCardHeader: React.FC<CardHeaderProps> = (props) => <CardHeader {...props} />;
export const AuroraCardMedia: React.FC<CardMediaProps> = (props) => <CardMedia {...props} />;