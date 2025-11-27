import React from 'react';
import { 
  Dialog, DialogProps, 
  DialogTitle, DialogTitleProps, 
  DialogContent, DialogContentProps, 
  DialogContentText, DialogContentTextProps, 
  DialogActions, DialogActionsProps 
} from '@mui/material';

export const AuroraDialog: React.FC<DialogProps> = (props) => <Dialog {...props} />;
export const AuroraDialogTitle: React.FC<DialogTitleProps> = (props) => <DialogTitle {...props} />;
export const AuroraDialogContent: React.FC<DialogContentProps> = (props) => <DialogContent {...props} />;
export const AuroraDialogContentText: React.FC<DialogContentTextProps> = (props) => <DialogContentText {...props} />;
export const AuroraDialogActions: React.FC<DialogActionsProps> = (props) => <DialogActions {...props} />;
