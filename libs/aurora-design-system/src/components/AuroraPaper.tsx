import React from 'react';
import { Paper } from '@mui/material';
import type { PaperProps } from '@mui/material';

export type AuroraPaperProps = PaperProps;

export const AuroraPaper: React.FC<AuroraPaperProps> = (props) => {
  return <Paper elevation={0} {...props} />;
};
