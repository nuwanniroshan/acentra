import React from 'react';
import {
  Checkbox,
  Radio,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup,
  FormControlLabel
} from '@mui/material';
import type {
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
  ToggleButtonProps,
  ToggleButtonGroupProps,
  FormControlLabelProps
} from '@mui/material';

export const AuroraCheckbox: React.FC<CheckboxProps> = (props) => <Checkbox {...props} />;
export const AuroraRadio: React.FC<RadioProps> = (props) => <Radio {...props} />;
export const AuroraRadioGroup: React.FC<RadioGroupProps> = (props) => <RadioGroup {...props} />;
export const AuroraToggleButton: React.FC<ToggleButtonProps> = (props) => <ToggleButton {...props} />;
export const AuroraToggleButtonGroup: React.FC<ToggleButtonGroupProps> = (props) => <ToggleButtonGroup {...props} />;
export const AuroraFormControlLabel: React.FC<FormControlLabelProps> = (props) => <FormControlLabel {...props} />;
