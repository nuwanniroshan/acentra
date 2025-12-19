import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import type { AlertProps, AlertTitleProps } from '@mui/material';

export const AuroraAlert: React.FC<AlertProps> = (props) => <Alert variant="filled" {...props} />;
export const AuroraAlertTitle: React.FC<AlertTitleProps> = (props) => <AlertTitle {...props} />;
