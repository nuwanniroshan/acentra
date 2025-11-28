import React from 'react';
import { Button, IconButton } from '@mui/material';
import type { ButtonProps, IconButtonProps } from '@mui/material';

export interface AuroraButtonProps extends ButtonProps {}
export interface AuroraIconButtonProps extends IconButtonProps {}

/**
 * AuroraButton
 * 
 * A wrapper around MUI's Button component.
 * Supports all standard MUI props.
 */
export const AuroraButton: React.FC<AuroraButtonProps> = (props) => {
  return <Button {...props} />;
};

/**
 * AuroraIconButton
 * 
 * A wrapper around MUI's IconButton component.
 */
export const AuroraIconButton: React.FC<AuroraIconButtonProps> = (props) => {
  return <IconButton {...props} />;
};