/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import {
  AuroraBox,
  AuroraTypography,
  AuroraInput,
  AuroraTabs,
  AuroraTab,
  AuroraChip,
} from '@acentra/aurora-design-system';
import { Search as SearchIcon } from '@mui/icons-material';
import {
  EMAIL_PLACEHOLDERS,
  PLACEHOLDER_CATEGORIES,
  searchPlaceholders,
  type EmailPlaceholder,
} from '@/constants/emailPlaceholders';
import { PlaceholderChip } from './PlaceholderChip';

interface PlaceholderGuideProps {
  onPlaceholderCopy?: (key: string) => void;
  compact?: boolean;
}

export const PlaceholderGuide: React.FC<PlaceholderGuideProps> = ({
  onPlaceholderCopy,
  compact = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter placeholders based on search and category
  const filteredPlaceholders = useMemo(() => {
    let placeholders = EMAIL_PLACEHOLDERS;

    // Apply search filter
    if (searchQuery.trim()) {
      placeholders = searchPlaceholders(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      placeholders = placeholders.filter(p => p.category === selectedCategory);
    }

    return placeholders;
  }, [searchQuery, selectedCategory]);

  // Group placeholders by category for display
  const groupedPlaceholders = useMemo(() => {
    const groups: Record<string, EmailPlaceholder[]> = {};

    filteredPlaceholders.forEach(placeholder => {
      if (!groups[placeholder.category]) {
        groups[placeholder.category] = [];
      }
      groups[placeholder.category].push(placeholder);
    });

    return groups;
  }, [filteredPlaceholders]);

  const handleCategoryChange = (_event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const getCategoryLabel = (category: string) => {
    return PLACEHOLDER_CATEGORIES.find(c => c.value === category)?.label || category;
  };

  return (
    <AuroraBox sx={{ width: '100%' }}>
      {/* Header */}
      {!compact && (
        <AuroraBox sx={{ mb: 3 }}>
          <AuroraTypography variant="h6" gutterBottom>
            Available Placeholders
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            Click the copy icon to insert a placeholder into your email template.
            Hover over a placeholder to see its description and example.
          </AuroraTypography>
        </AuroraBox>
      )}

      {/* Search */}
      <AuroraBox sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SearchIcon sx={{ color: 'text.secondary' }} />
        <AuroraInput
          fullWidth
          placeholder="Search placeholders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
        />
      </AuroraBox>

      {/* Category Tabs */}
      <AuroraBox sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <AuroraTabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <AuroraTab label="All" value="all" />
          {PLACEHOLDER_CATEGORIES.map(category => (
            <AuroraTab
              key={category.value}
              label={category.label}
              value={category.value}
            />
          ))}
        </AuroraTabs>
      </AuroraBox>

      {/* Placeholders Display */}
      <AuroraBox sx={{ maxHeight: compact ? 400 : 600, overflowY: 'auto' }}>
        {filteredPlaceholders.length === 0 ? (
          <AuroraBox sx={{ textAlign: 'center', py: 4 }}>
            <AuroraTypography color="text.secondary">
              No placeholders found matching &quot;{searchQuery}&quot;
            </AuroraTypography>
          </AuroraBox>
        ) : selectedCategory === 'all' ? (
          // Show grouped by category when "All" is selected
          Object.entries(groupedPlaceholders).map(([category, placeholders]) => (
            <AuroraBox key={category} sx={{ mb: 3 }}>
              <AuroraTypography
                variant="subtitle2"
                sx={{
                  fontWeight: 'bold',
                  mb: 1.5,
                  color: 'primary.main',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                }}
              >
                {getCategoryLabel(category)}
              </AuroraTypography>
              <AuroraBox
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  pl: 1,
                }}
              >
                {placeholders.map(placeholder => (
                  <PlaceholderChip
                    key={placeholder.key}
                    placeholder={placeholder}
                    onCopy={onPlaceholderCopy}
                    size="small"
                  />
                ))}
              </AuroraBox>
            </AuroraBox>
          ))
        ) : (
          // Show flat list when a specific category is selected
          <AuroraBox
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {filteredPlaceholders.map(placeholder => (
              <PlaceholderChip
                key={placeholder.key}
                placeholder={placeholder}
                onCopy={onPlaceholderCopy}
                size="small"
              />
            ))}
          </AuroraBox>
        )}
      </AuroraBox>

      {/* Footer Stats */}
      {!compact && (
        <AuroraBox
          sx={{
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <AuroraTypography variant="caption" color="text.secondary">
            {filteredPlaceholders.length} of {EMAIL_PLACEHOLDERS.length} placeholders
          </AuroraTypography>
          <AuroraChip
            label={`${PLACEHOLDER_CATEGORIES.length} categories`}
            size="small"
            variant="outlined"
          />
        </AuroraBox>
      )}
    </AuroraBox>
  );
};
