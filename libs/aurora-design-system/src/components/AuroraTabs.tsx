import React from 'react';
import { Tabs, Tab } from '@mui/material';
import type { TabsProps, TabProps } from '@mui/material';

export const AuroraTabs: React.FC<TabsProps> = (props) => <Tabs {...props} />;
export const AuroraTab: React.FC<TabProps> = (props) => <Tab {...props} />;
