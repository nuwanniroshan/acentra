import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AuroraBox,
  AuroraList,
  AuroraListItemButton,
  AuroraListItemIcon,
  AuroraListItemText,
  AuroraTypography,
  AuroraDivider,
} from '@acentra/aurora-design-system';
import { Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { settingsConfig } from '@/config/settingsConfig';

interface SettingsSidebarProps {
  onSectionChange?: (sectionId: string) => void;
}

export function SettingsSidebar({ onSectionChange }: SettingsSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Initialize with first category expanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['personal']);

  // Auto-expand category based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentCategory = settingsConfig.find((category) =>
      category.sections.some((section) => section.path === currentPath)
    );

    if (currentCategory && !expandedCategories.includes(currentCategory.id)) {
      setExpandedCategories((prev) => [...prev, currentCategory.id]);
    }
  }, [location.pathname]);

  const hasAccess = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true;
    return roles.includes(user.role);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Check if a path is active by comparing the settings portion of the URL
  const isActive = (configPath: string) => {
    // Extract the settings path portion from config (e.g., /settings/personal/profile -> personal/profile)
    const settingsPath = configPath.replace('/settings/', '');
    // Check if current location ends with this path
    return location.pathname.endsWith(settingsPath);
  };

  const handleSectionClick = (configPath: string, sectionId: string) => {
    // Convert config path to tenant-aware path
    // Get tenant from current location (e.g., /acme/settings -> acme)
    const pathParts = location.pathname.split('/');
    const tenant = pathParts[1]; // Assuming /:tenant/settings structure

    // Build the full path: /:tenant/settings/personal/profile
    const settingsPath = configPath.replace('/settings/', '');
    const fullPath = `/${tenant}/settings/${settingsPath}`;

    navigate(fullPath);
    if (onSectionChange) {
      onSectionChange(sectionId);
    }
  };

  const visibleCategories = settingsConfig.filter((category) => hasAccess(category.roles));

  return (
    <AuroraBox
      sx={{
        width: 240,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        height: '100%',
        overflow: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      <AuroraList sx={{ py: 1, px: 1 }}>
        {visibleCategories.map((category, categoryIndex) => (
          <div key={category.id}>
            {categoryIndex > 0 && <AuroraDivider sx={{ my: 1.5 }} />}

            {/* Category Header */}
            <AuroraListItemButton
              onClick={() => toggleCategory(category.id)}
              sx={{
                py: 0.75,
                px: 1.5,
                mb: 0.5,
                borderRadius: 1,
                minHeight: 36,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <AuroraListItemIcon sx={{ minWidth: 32, color: 'text.secondary', fontSize: 18 }}>
                {category.icon}
              </AuroraListItemIcon>
              <AuroraListItemText
                primary={
                  <AuroraTypography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                    }}
                  >
                    {category.label}
                  </AuroraTypography>
                }
              />
              {expandedCategories.includes(category.id) ? (
                <ExpandLessIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              ) : (
                <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              )}
            </AuroraListItemButton>

            {/* Category Sections */}
            <Collapse in={expandedCategories.includes(category.id)} timeout="auto">
              <AuroraList component="div" disablePadding>
                {category.sections
                  .filter((section) => hasAccess(section.roles))
                  .map((section) => {
                    const active = isActive(section.path);

                    return (
                      <AuroraListItemButton
                        key={section.id}
                        selected={active}
                        onClick={() => handleSectionClick(section.path, section.id)}
                        sx={{
                          pl: 3,
                          pr: 1.5,
                          py: 0.75,
                          my: 0.25,
                          borderRadius: 1,
                          minHeight: 36,
                          '&.Mui-selected': {
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.dark',
                            },
                            '& .MuiListItemIcon-root': {
                              color: 'primary.contrastText',
                            },
                          },
                          '&:hover': {
                            bgcolor: active ? 'primary.dark' : 'action.hover',
                          },
                        }}
                      >
                        {section.icon && (
                          <AuroraListItemIcon
                            sx={{
                              minWidth: 28,
                              fontSize: 18,
                              color: active ? 'inherit' : 'text.secondary',
                            }}
                          >
                            {section.icon}
                          </AuroraListItemIcon>
                        )}
                        <AuroraListItemText
                          primary={
                            <AuroraTypography
                              variant="body2"
                              sx={{
                                fontWeight: active ? 600 : 400,
                                fontSize: '0.875rem',
                              }}
                            >
                              {section.label}
                            </AuroraTypography>
                          }
                        />
                      </AuroraListItemButton>
                    );
                  })}
              </AuroraList>
            </Collapse>
          </div>
        ))}
      </AuroraList>
    </AuroraBox>
  );
}
