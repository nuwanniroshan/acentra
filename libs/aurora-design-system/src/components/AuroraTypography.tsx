import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export type AuroraTypographyProps = TypographyProps;

export const AuroraTypography: React.FC<AuroraTypographyProps> = (props) => {
  return <Typography {...props} />;
};
