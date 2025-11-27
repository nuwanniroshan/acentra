import React from 'react';
import { 
  AppBar, AppBarProps, 
  Toolbar, ToolbarProps, 
  Menu, MenuProps, 
  BottomNavigation, BottomNavigationProps, 
  BottomNavigationAction, BottomNavigationActionProps,
  Breadcrumbs, BreadcrumbsProps,
  Pagination, PaginationProps
} from '@mui/material';

export const AuroraAppBar: React.FC<AppBarProps> = (props) => <AppBar {...props} />;
export const AuroraToolbar: React.FC<ToolbarProps> = (props) => <Toolbar {...props} />;
export const AuroraMenu: React.FC<MenuProps> = (props) => <Menu {...props} />;
export const AuroraBottomNavigation: React.FC<BottomNavigationProps> = (props) => <BottomNavigation {...props} />;
export const AuroraBottomNavigationAction: React.FC<BottomNavigationActionProps> = (props) => <BottomNavigationAction {...props} />;
export const AuroraBreadcrumbs: React.FC<BreadcrumbsProps> = (props) => <Breadcrumbs {...props} />;
export const AuroraPagination: React.FC<PaginationProps> = (props) => <Pagination {...props} />;