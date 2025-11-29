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

    // If we're on the root path, clear tenant
    if (!possibleTenant) {
      setTenant(null);
      localStorage.removeItem('tenantId');
      return;
    }

    // Check if we already have a validated tenant in localStorage
    const storedTenant = localStorage.getItem('tenantId');
    
    // If the current path starts with the stored tenant, use it
    if (storedTenant && possibleTenant === storedTenant) {
      setTenant(storedTenant);
      return;
    }

    // Only validate if this looks like a tenant root path (not a nested route)
    // and we don't have a stored tenant, or the stored tenant doesn't match
    const validateTenant = async () => {
      // Only validate if the path is exactly /tenant or /tenant/
      const isTenantRootPath = location.pathname === `/${possibleTenant}` || location.pathname === `/${possibleTenant}/`;
      if (possibleTenant && /^[a-zA-Z0-9-]+$/.test(possibleTenant) && isTenantRootPath) {
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

      // If validation failed and we're not on root, redirect to root
      if (location.pathname !== '/' && location.pathname !== '') {
        // Only redirect if we don't have a stored tenant
        if (!storedTenant) {
          navigate('/');
        }
      } else {
        setTenant(null);
        localStorage.removeItem('tenantId');
      }
    };

    // Only validate if:
    // 1. We don't have a stored tenant, OR
    // 2. The possible tenant doesn't match the stored tenant
    if (!storedTenant || possibleTenant !== storedTenant) {
      validateTenant();
    }
  }, [location.pathname, navigate]);

  return <TenantProvider value={tenant}>{children}</TenantProvider>;
}
