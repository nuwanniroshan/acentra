import React from 'react';
import { 
  List, ListProps, 
  ListItem, ListItemProps, 
  ListItemText, ListItemTextProps, 
  ListItemIcon, ListItemIconProps,
  ListItemButton, ListItemButtonProps,
  ListSubheader, ListSubheaderProps,
  ListItemAvatar, ListItemAvatarProps
} from '@mui/material';

export const AuroraList: React.FC<ListProps> = (props) => <List {...props} />;
export const AuroraListItem: React.FC<ListItemProps> = (props) => <ListItem {...props} />;
export const AuroraListItemText: React.FC<ListItemTextProps> = (props) => <ListItemText {...props} />;
export const AuroraListItemIcon: React.FC<ListItemIconProps> = (props) => <ListItemIcon {...props} />;
export const AuroraListItemButton: React.FC<ListItemButtonProps> = (props) => <ListItemButton {...props} />;
export const AuroraListSubheader: React.FC<ListSubheaderProps> = (props) => <ListSubheader {...props} />;
export const AuroraListItemAvatar: React.FC<ListItemAvatarProps> = (props) => <ListItemAvatar {...props} />;