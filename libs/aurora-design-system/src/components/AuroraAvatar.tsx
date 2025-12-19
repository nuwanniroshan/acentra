import React from 'react';
import { Avatar, AvatarGroup } from '@mui/material';
import type { AvatarProps, AvatarGroupProps } from '@mui/material';

export const AuroraAvatar: React.FC<AvatarProps> = (props) => <Avatar {...props} />;
export const AuroraAvatarGroup: React.FC<AvatarGroupProps> = (props) => <AvatarGroup {...props} />;
