import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import type {
  SelectProps,
  MenuItemProps,
  FormControlProps,
  InputLabelProps
} from '@mui/material';

export const AuroraSelect = <T,>(props: SelectProps<T>) => <Select<T> {...props} />;
export const AuroraMenuItem: React.FC<MenuItemProps> = (props) => <MenuItem {...props} />;
export const AuroraFormControl: React.FC<FormControlProps> = (props) => <FormControl {...props} />;
export const AuroraInputLabel: React.FC<InputLabelProps> = (props) => <InputLabel {...props} />;
