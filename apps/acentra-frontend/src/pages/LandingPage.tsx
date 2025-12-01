import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuroraBox,
  AuroraButton,
  AuroraTypography,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogContentText,
  AuroraDialogActions,
  AuroraInput,
  AuroraPaper,
  AuroraGrid,
} from '@acentra/aurora-design-system';
import { Container, Stack } from '@mui/material';

export default function LandingPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [slug, setSlug] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const go = () => {
    if (slug.trim()) {
      const tenantSlug = slug.trim().toLowerCase();
      localStorage.setItem('tenantId', tenantSlug);
      navigate(`/${tenantSlug}`);
    }
  };

  return (
    <AuroraBox sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AuroraBox component="header" sx={{ py: 2, px: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <AuroraTypography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          acentra.
        </AuroraTypography>
        <AuroraButton variant="contained" onClick={handleLoginClick}>
          Login
        </AuroraButton>
      </AuroraBox>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 8 }}>
        <AuroraGrid container spacing={6} alignItems="center">
          <AuroraGrid size={{ xs: 12, md: 6 }}>
            <AuroraBox>
              <AuroraBox sx={{ 
                display: 'inline-block', 
                bgcolor: 'primary.light', 
                color: 'primary.dark', 
                px: 2, 
                py: 0.5, 
                borderRadius: 2, 
                mb: 2,
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                Modern HR Management
              </AuroraBox>
              <AuroraTypography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ lineHeight: 1.2 }}>
                Transform Your <br />
                <AuroraBox component="span" sx={{ color: 'primary.main' }}>Workforce Management</AuroraBox>
              </AuroraTypography>
              <AuroraTypography variant="h6" color="text.secondary" sx={{ mb: 4, fontWeight: 400, maxWidth: 500 }}>
                The all-in-one HR platform that empowers teams to work smarter. From recruitment to payroll, we've got you covered.
              </AuroraTypography>
              <Stack direction="row" spacing={2}>
                <AuroraButton variant="contained" size="large" onClick={handleLoginClick}>
                  Get Started →
                </AuroraButton>
                <AuroraButton variant="outlined" size="large" onClick={handleLoginClick}>
                  Watch Demo
                </AuroraButton>
              </Stack>
              
              <Stack direction="row" spacing={3} sx={{ mt: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                   <AuroraTypography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                     ✓ Reduce administrative workload
                   </AuroraTypography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                   <AuroraTypography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                     ✓ Increase employee satisfaction
                   </AuroraTypography>
                </Stack>
              </Stack>
            </AuroraBox>
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, md: 6 }}>
             <AuroraPaper 
                elevation={6} 
                sx={{ 
                  height: 400, 
                  width: '100%', 
                  bgcolor: 'grey.200', 
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} 
             />
          </AuroraGrid>
        </AuroraGrid>
      </Container>

      {/* Login Dialog */}
      <AuroraDialog open={openLogin} onClose={handleCloseLogin} maxWidth="xs" fullWidth>
        <AuroraDialogTitle>Sign in to your workspace</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraDialogContentText sx={{ mb: 2 }}>
            Enter your company's workspace name to continue.
          </AuroraDialogContentText>
          <AuroraInput
            autoFocus
            margin="dense"
            label="Company Name"
            placeholder="your-company-name"
            fullWidth
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && go()}
          />
        </AuroraDialogContent>
        <AuroraDialogActions sx={{ p: 3, pt: 0 }}>
          <AuroraButton onClick={handleCloseLogin} color="inherit">
            Cancel
          </AuroraButton>
          <AuroraButton onClick={go} variant="contained" disabled={!slug.trim()}>
            Continue
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
