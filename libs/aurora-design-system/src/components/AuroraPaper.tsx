import React from 'react';
import { Paper, PaperProps } from '@mui/material';

export type AuroraPaperProps = PaperProps;

export const AuroraPaper: React.FC<AuroraPaperProps> = (props) => {
  return <Paper elevation={0} {...props} />;
};
