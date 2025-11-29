import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/authSlice';
import {
  AuroraBox,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraLink,
  AuroraAlert,
  AuroraCheckbox,
  AuroraDivider,
} from '@acentra/aurora-design-system';

interface LoginProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && onSuccess) {
      onSuccess();
    }
  }, [user, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <AuroraBox sx={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Left Side - Logo Placeholder */}
      <AuroraBox
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        <AuroraTypography
          variant="h4"
          sx={{ color: 'primary.main', fontWeight: 'bold' }} // Purple color as placeholder
        >
          acentra.
        </AuroraTypography>
      </AuroraBox>

      {/* Right Side - Login Form */}
      <AuroraBox
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          bgcolor: 'background.default',
          position: 'relative',
        }}
      >
        <AuroraBox sx={{ width: '100%', maxWidth: 400 }}>
          <AuroraTypography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
            Log in
          </AuroraTypography>

          <AuroraBox sx={{ textAlign: 'center', mb: 3 }}>
            <AuroraLink
              component="button"
              variant="body2"
              onClick={() => {
                localStorage.removeItem('tenantId');
                navigate('/');
              }}
            >
              Switch to different client
            </AuroraLink>
          </AuroraBox>

          {error && (
            <AuroraAlert severity="error" sx={{ mb: 3 }}>
              {error}
            </AuroraAlert>
          )}

          <form onSubmit={handleSubmit}>
            <AuroraInput
              fullWidth
              label="Email"
              type="email"
              placeholder="demo@aurora.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <AuroraInput
              fullWidth
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              margin="normal"
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <AuroraBox
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <AuroraBox sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Assuming AuroraCheckbox works like MUI Checkbox */}
                <AuroraCheckbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                />
                <AuroraTypography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  Remember this device
                </AuroraTypography>
              </AuroraBox>

              <AuroraLink
                component="button"
                type="button"
                variant="body2"
                onClick={onForgotPassword}
              >
                Forgot Password?
              </AuroraLink>
            </AuroraBox>

            <AuroraButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, mb: 4 }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </AuroraButton>
          </form>

          <AuroraBox sx={{ textAlign: 'center' }}>
            <AuroraLink href="/help" variant="body2" color="primary">
              Trouble signing in?
            </AuroraLink>
          </AuroraBox>
        </AuroraBox>
      </AuroraBox>
    </AuroraBox>
  );
};

export default Login;
