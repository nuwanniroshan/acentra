import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuroraInput, AuroraButton, AuroraBox, AuroraTypography, AuroraPaper } from '@acentra/aurora-design-system';

export default function LandingPage() {
  const [slug, setSlug] = useState('');
  const navigate = useNavigate();

  const go = () => {
    if (slug.trim()) {
      const tenantSlug = slug.trim().toLowerCase();
      localStorage.setItem('tenantId', tenantSlug);
      navigate(`/${tenantSlug}`);
    }
  };

  return (
    <AuroraBox 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <AuroraPaper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 3,
          width: '100%',
          maxWidth: 400
        }}
      >
        <AuroraTypography variant="h4" component="h1" fontWeight="bold" color="primary">
          acentra.
        </AuroraTypography>
        
        <AuroraTypography variant="body1" color="text.secondary" align="center">
          Enter your company name to access your dashboard.
        </AuroraTypography>

        <AuroraInput
          placeholder="your-company-name"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          fullWidth
          label="Company Name"
        />

        <AuroraButton 
          onClick={go} 
          variant="contained" 
          fullWidth 
          size="large"
          disabled={!slug.trim()}
        >
          Go to Dashboard
        </AuroraButton>
      </AuroraPaper>
    </AuroraBox>
  );
}
