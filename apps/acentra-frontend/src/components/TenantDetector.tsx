import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { validateTenant, setTenant, clearTenant } from '@/store/tenantSlice';
import type { RootState } from '@/store/store';
import { TenantProvider } from '@/context/TenantContext'; // Keep for backward compatibility if needed

export function TenantDetector({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const tenant = useAppSelector((state: RootState) => state.tenant.tenantId);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    const possibleTenant = segments[0];

    // If we're on the root path, clear tenant
    if (!possibleTenant) {
      if (tenant) {
        dispatch(clearTenant());
        localStorage.removeItem('tenantId');
      }
      return;
    }

    // If the possible tenant is "null" (string) or some other reserved word, redirect to root
    if (possibleTenant === 'null' || possibleTenant === 'undefined') {
        dispatch(clearTenant());
        localStorage.removeItem('tenantId');
        navigate('/', { replace: true });
        return;
    }

    const storedTenant = localStorage.getItem('tenantId');

    // If we have a stored tenant and it matches the URL, ensure it's in Redux
    if (storedTenant && possibleTenant === storedTenant) {
      if (tenant !== storedTenant) {
        dispatch(setTenant(storedTenant));
      }
      return;
    }

    // If URL tenant doesn't match stored tenant, validate it
    if (possibleTenant && /^[a-zA-Z0-9-]+$/.test(possibleTenant)) {
        dispatch(validateTenant(possibleTenant))
            .unwrap()
            .then(() => {
                // Success - tenant is valid
            })
            .catch(() => {
                // Invalid tenant - redirect to root
                // Only redirect if we are not already on root to avoid loops
                if (location.pathname !== '/') {
                    navigate('/', { replace: true });
                }
            });
    } else {
        // Invalid format
        navigate('/', { replace: true });
    }

  }, [location.pathname, dispatch, navigate, tenant]);

  return <TenantProvider value={tenant}>{children}</TenantProvider>;
}
