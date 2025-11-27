import React from 'react';
import { Box, BoxProps, Container, ContainerProps, Stack, StackProps, Grid, GridProps } from '@mui/material';

export const AuroraBox: React.FC<BoxProps> = (props) => <Box {...props} />;
export const AuroraContainer: React.FC<ContainerProps> = (props) => <Container {...props} />;
export const AuroraStack: React.FC<StackProps> = (props) => <Stack {...props} />;
export const AuroraGrid: React.FC<React.ComponentProps<typeof Grid>> = (props) => <Grid {...props} />;