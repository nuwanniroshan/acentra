import React from 'react';
import { Switch, SwitchProps, FormControlLabel } from '@mui/material';

export interface AuroraSwitchProps extends SwitchProps {
  label?: string;
}

/**
 * AuroraSwitch
 * 
 * A wrapper around MUI's Switch component.
 * Includes optional label support via FormControlLabel.
 */
export const AuroraSwitch: React.FC<AuroraSwitchProps> = ({ label, ...props }) => {
  if (label) {
    return (
      <FormControlLabel
        control={<Switch {...props} />}
        label={label}
        sx={{ color: 'text.secondary' }}
      />
    );
  }
  return <Switch {...props} />;
};