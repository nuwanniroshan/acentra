import React from 'react';
import { Chip, alpha, useTheme } from '@mui/material';
import type { ChipProps } from '@mui/material';

export type AuroraChipStatus = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'neutral' | 'pending';

export interface AuroraChipProps extends Omit<ChipProps, 'color'> {
  status?: AuroraChipStatus;
  color?: ChipProps['color'];
}

/**
 * AuroraChip
 * 
 * A standardized Chip component for the Aurora Design System.
 * Supports predefined statuses with consistent styling across themes.
 * It automatically maps statuses to theme colors and applies premium styling.
 */
export const AuroraChip: React.FC<AuroraChipProps> = ({
  status,
  sx = {},
  variant = 'filled',
  ...props
}) => {
  const theme = useTheme();

  const getStatusStyles = () => {
    if (!status) return {};

    // Map custom statuses to theme palette keys or fallback to primary
    let paletteKey: any = status;
    if (status === 'pending') paletteKey = 'warning';

    // Handle neutral separately since grey palette doesn't have main/light/dark properties
    if (status === 'neutral') {
      const greyColor = theme.palette.grey[500] || '#94a3b8';
      const greyText = theme.palette.text.secondary;

      if (variant === 'filled') {
        return {
          backgroundColor: alpha(greyColor, 0.12),
          color: greyText,
          fontWeight: 700,
          border: `1px solid ${alpha(greyColor, 0.2)}`,
          '& .MuiChip-label': { px: 1.5 }
        };
      }
      return {
        borderColor: alpha(greyColor, 0.3),
        color: greyText,
        fontWeight: 600,
        backgroundColor: 'transparent',
      };
    }

    // Get colors from theme or fallback to primary
    const palette = theme.palette[paletteKey] || theme.palette.primary;
    const mainColor = palette?.main || theme.palette.primary.main;
    const lightColor = palette?.light || theme.palette.primary.light;
    const darkColor = palette?.dark || theme.palette.primary.dark;

    if (variant === 'filled') {
      return {
        backgroundColor: alpha(mainColor, 0.12),
        color: theme.palette.mode === 'dark' ? lightColor : darkColor,
        fontWeight: 700,
        border: `1px solid ${alpha(mainColor, 0.2)}`,
        '& .MuiChip-label': {
          px: 1.5,
        }
      };
    }

    if (variant === 'outlined') {
      return {
        borderColor: alpha(mainColor, 0.5),
        color: mainColor,
        fontWeight: 600,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: alpha(mainColor, 0.04),
          borderColor: mainColor,
        }
      };
    }

    return {};
  };

  return (
    <Chip
      variant={variant === 'outlined' ? 'outlined' : 'filled'}
      sx={{
        borderRadius: '6px',
        fontSize: '0.7rem',
        height: 24,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        transition: 'all 0.2s ease',
        ...getStatusStyles(),
        ...sx,
      }}
      {...props}
    />
  );
};
