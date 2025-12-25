import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
} from '@acentra/aurora-design-system';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useNavigate, useLocation } from 'react-router-dom';

interface ComingSoonPlaceholderProps {
  title?: string;
  description?: string;
}

export function ComingSoonPlaceholder({ title, description }: ComingSoonPlaceholderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // Navigate to settings home
    const pathParts = location.pathname.split('/');
    const tenant = pathParts[1];
    navigate(`/${tenant}/settings`);
  };

  return (
    <AuroraBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        textAlign: 'center',
        py: 8,
      }}
    >
      <AuroraBox
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <RocketLaunchIcon sx={{ fontSize: 64, color: 'primary.main' }} />
      </AuroraBox>

      <AuroraTypography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        {title || 'Coming Soon'}
      </AuroraTypography>

      <AuroraTypography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 500, mb: 4, lineHeight: 1.7 }}
      >
        {description ||
          'This feature is currently under development and will be available in a future update. We\'re working hard to bring you the best experience!'}
      </AuroraTypography>

      <AuroraBox sx={{ display: 'flex', gap: 2 }}>
        <AuroraButton variant="outlined" onClick={handleGoBack}>
          Back to Settings
        </AuroraButton>
      </AuroraBox>
    </AuroraBox>
  );
}
