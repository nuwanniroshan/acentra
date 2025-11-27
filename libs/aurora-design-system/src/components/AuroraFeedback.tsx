import React from 'react';
import { Snackbar, SnackbarProps, Popover, PopoverProps } from '@mui/material';

export const AuroraSnackbar: React.FC<SnackbarProps> = (props) => <Snackbar {...props} />;
export const AuroraPopover: React.FC<PopoverProps> = (props) => <Popover {...props} />;