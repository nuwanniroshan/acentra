import React from 'react';
import { Skeleton } from '@mui/material';
import type { SkeletonProps } from '@mui/material';

export const AuroraSkeleton: React.FC<SkeletonProps> = (props) => <Skeleton {...props} />;
