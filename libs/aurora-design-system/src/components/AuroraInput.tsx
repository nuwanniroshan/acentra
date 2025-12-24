import React from 'react';
import { TextField, InputBase } from '@mui/material';
import type { TextFieldProps, InputBaseProps } from '@mui/material';

export type AuroraInputProps = TextFieldProps;
export type AuroraInputBaseProps = InputBaseProps;

/**
 * AuroraInput
 * 
 * A wrapper around MUI's TextField component.
 */
export const AuroraInput: React.FC<AuroraInputProps> = (props) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      InputLabelProps={{ shrink: true }}
      {...props}
    />
  );
};

export const AuroraTextField = AuroraInput;


/**
 * AuroraInputBase
 * 
 * A wrapper around MUI's InputBase component (unstyled input).
 */
export const AuroraInputBase: React.FC<AuroraInputBaseProps> = (props) => {
  return <InputBase {...props} />;
};