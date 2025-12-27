/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  AuroraChip,
  AuroraTooltip,
  AuroraBox,
  AuroraTypography,
  AuroraIconButton,
} from '@acentra/aurora-design-system';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import type { EmailPlaceholder } from '@/constants/emailPlaceholders';

interface PlaceholderChipProps {
  placeholder: EmailPlaceholder;
  onCopy?: (key: string) => void;
  size?: 'small' | 'medium';
  showCopyButton?: boolean;
}

export const PlaceholderChip: React.FC<PlaceholderChipProps> = ({
  placeholder,
  onCopy,
  size = 'medium',
  showCopyButton = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(placeholder.key);
      setCopied(true);
      onCopy?.(placeholder.key);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleChipClick = () => {
    if (!showCopyButton) {
      handleCopy({} as React.MouseEvent);
    }
  };

  const tooltipContent = (
    <AuroraBox sx={{ p: 1 }}>
      <AuroraTypography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        {placeholder.label}
      </AuroraTypography>
      <AuroraTypography variant="body2" sx={{ mb: 1 }}>
        {placeholder.description}
      </AuroraTypography>
      <AuroraTypography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
        Example: {placeholder.example}
      </AuroraTypography>
    </AuroraBox>
  );

  return (
    <AuroraTooltip title={tooltipContent} arrow placement="top">
      <AuroraBox
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <AuroraChip
          label={placeholder.key}
          size={size}
          variant="outlined"
          onClick={handleChipClick}
          sx={{
            fontFamily: 'monospace',
            cursor: showCopyButton ? 'default' : 'pointer',
            '&:hover': {
              backgroundColor: showCopyButton ? 'inherit' : 'action.hover',
            },
          }}
        />
        {showCopyButton && (
          <AuroraIconButton
            size="small"
            onClick={handleCopy}
            sx={{
              width: 24,
              height: 24,
              padding: 0.5,
            }}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            <ContentCopyIcon fontSize="small" />
          </AuroraIconButton>
        )}
        {copied && (
          <AuroraTypography
            variant="caption"
            sx={{
              color: 'success.main',
              fontWeight: 'medium',
              animation: 'fadeIn 0.2s ease-in',
            }}
          >
            Copied!
          </AuroraTypography>
        )}
      </AuroraBox>
    </AuroraTooltip>
  );
};
