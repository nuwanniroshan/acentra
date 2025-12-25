import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  AuroraBox,
  AuroraDrawer,
  AuroraIconButton,
  AuroraTextField,
} from '@acentra/aurora-design-system';
import { useMediaQuery, useTheme, InputAdornment } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { settingsConfig, findSectionByPath, getCategoryForSection } from '@/config/settingsConfig';

export function Settings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionChange = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Get current section info for breadcrumbs
  const currentSection = findSectionByPath(location.pathname);
  const currentCategory = currentSection
    ? getCategoryForSection(currentSection.id)
    : undefined;

  const breadcrumbs = currentSection && currentCategory
    ? [
      { label: currentCategory.label },
      { label: currentSection.label },
    ]
    : [];

  // Sidebar content
  const sidebarContent = <SettingsSidebar onSectionChange={handleSectionChange} />;

  // Get user for default redirect (use relative path since we're in nested route)
  const defaultPath = 'personal/profile';

  return (
    <AuroraBox sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Mobile Header */}
      {isMobile && (
        <AuroraBox
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: 1100,
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <AuroraIconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </AuroraIconButton>
          <AuroraTextField
            placeholder="Search settings..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />
        </AuroraBox>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <AuroraBox
          component="nav"
          sx={{
            width: 240,
            flexShrink: 0,
          }}
        >
          {sidebarContent}
        </AuroraBox>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <AuroraDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          <AuroraBox
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <AuroraBox sx={{ fontWeight: 600 }}>Settings</AuroraBox>
            <AuroraIconButton onClick={handleDrawerToggle} size="small">
              <CloseIcon />
            </AuroraIconButton>
          </AuroraBox>
          {sidebarContent}
        </AuroraDrawer>
      )}

      {/* Main Content */}
      <AuroraBox
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: isMobile ? 10 : 3,
          overflow: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <AuroraBox sx={{ maxWidth: 900, mx: 'auto' }}>
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to={defaultPath} replace />} />

            {/* Generate routes for all sections */}
            {settingsConfig.flatMap((category) =>
              category.sections.map((section) => {
                const Component = section.component;
                // Extract relative path (remove /settings prefix)
                const relativePath = section.path.replace('/settings/', '');

                return (
                  <Route
                    key={section.path}
                    path={relativePath}
                    element={
                      <SettingsLayout
                        title={section.label}
                        description={section.description}
                        breadcrumbs={breadcrumbs}
                      >
                        <AuroraBox
                          sx={{
                            p: 4,
                            bgcolor: 'background.paper',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            minHeight: 400,
                          }}
                        >
                          <Component />
                        </AuroraBox>
                      </SettingsLayout>
                    }
                  />
                );
              })
            )}

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to={defaultPath} replace />} />
          </Routes>
        </AuroraBox>
      </AuroraBox>
    </AuroraBox>
  );
}
