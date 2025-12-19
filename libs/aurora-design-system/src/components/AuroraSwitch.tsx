import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import type { SwitchProps } from '@mui/material';

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