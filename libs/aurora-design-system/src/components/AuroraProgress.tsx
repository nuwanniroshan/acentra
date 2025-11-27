import React from 'react';
import { CircularProgress, CircularProgressProps, LinearProgress, LinearProgressProps } from '@mui/material';

export const AuroraCircularProgress: React.FC<CircularProgressProps> = (props) => <CircularProgress {...props} />;
export const AuroraLinearProgress: React.FC<LinearProgressProps> = (props) => <LinearProgress {...props} />;
