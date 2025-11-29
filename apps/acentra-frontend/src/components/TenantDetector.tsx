import { useEffect, useState } from 'react';
import { TenantProvider } from '../context/TenantContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

export function TenantDetector({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const possibleTenant = segments[0];

    const validateTenant = async () => {
      if (possibleTenant && /^[a-zA-Z0-9-]+$/.test(possibleTenant)) {
        try {
          const response = await fetch(`${API_URL}/tenants/${possibleTenant}/check`);
          if (response.ok) {
            const data = await response.json();
            if (data.isActive) {
              setTenant(possibleTenant);
              localStorage.setItem('tenantId', possibleTenant);
              return;
            }
          }
        } catch (error) {
          console.error("Error validating tenant:", error);
        }
      }

      if (location.pathname !== '/' && location.pathname !== '') {
        // Invalid or missing tenant -> go home
        // Prevent infinite loop if we are already redirecting
        navigate('/');
      } else {
        setTenant(null);
        localStorage.removeItem('tenantId');
      }
    };

    validateTenant();
  }, [location.pathname, navigate]);

  return <TenantProvider value={tenant}>{children}</TenantProvider>;
}
