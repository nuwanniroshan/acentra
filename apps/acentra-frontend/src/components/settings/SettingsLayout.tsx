import {
  AuroraBox,
  AuroraTypography,
  AuroraBreadcrumbs,
} from '@acentra/aurora-design-system';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export interface Breadcrumb {
  label: string;
  path?: string;
}

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export function SettingsLayout({
  children,
  title,
  description,
  breadcrumbs = [],
}: SettingsLayoutProps) {
  const location = useLocation();

  // Get tenant from current path
  const pathParts = location.pathname.split('/');
  const tenant = pathParts[1];

  const defaultBreadcrumbs: Breadcrumb[] = [
    { label: 'Settings', path: `/${tenant}/settings` },
    ...breadcrumbs,
  ];

  return (
    <AuroraBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Breadcrumbs */}
      {defaultBreadcrumbs.length > 0 && (
        <AuroraBox sx={{ mb: 2 }}>
          <AuroraBreadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="settings breadcrumb"
          >
            {defaultBreadcrumbs.map((crumb, index) => {
              const isLast = index === defaultBreadcrumbs.length - 1;

              if (isLast || !crumb.path) {
                return (
                  <AuroraTypography
                    key={index}
                    color="text.primary"
                    variant="body2"
                    sx={{ fontWeight: 500 }}
                  >
                    {crumb.label}
                  </AuroraTypography>
                );
              }

              return (
                <RouterLink
                  key={index}
                  to={crumb.path}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <AuroraTypography
                    variant="body2"
                    sx={{
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {crumb.label}
                  </AuroraTypography>
                </RouterLink>
              );
            })}
          </AuroraBreadcrumbs>
        </AuroraBox>
      )}

      {/* Header */}
      <AuroraBox sx={{ mb: 3 }}>
        <AuroraTypography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </AuroraTypography>
        {description && (
          <AuroraTypography variant="body2" color="text.secondary">
            {description}
          </AuroraTypography>
        )}
      </AuroraBox>

      {/* Content */}
      <AuroraBox
        sx={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        {children}
      </AuroraBox>
    </AuroraBox>
  );
}
