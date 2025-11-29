import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  AuroraBox,
  AuroraCard,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraAlert,
  AuroraLink,
  AuroraLoginIcon,
} from '@acentra/aurora-design-system';

interface LoginProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  title?: string;
  subtitle?: string;
}

export const Login: React.FC<LoginProps> = ({
  onSuccess,
  onForgotPassword,
  title = 'Acentra',
  subtitle = 'Sign in to manage your recruitment pipeline',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBox
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <AuroraCard
        sx={{
          width: '100%',
          maxWidth: 450,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <AuroraBox sx={{ textAlign: 'center', mb: 4 }}>
          <AuroraTypography
            variant="h4"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            {title}
          </AuroraTypography>
          <AuroraTypography variant="body2" color="text.secondary">
            {subtitle}
          </AuroraTypography>
        </AuroraBox>

        {error && (
          <AuroraAlert severity="error" sx={{ mb: 3 }}>
            {error}
          </AuroraAlert>
        )}

        <form onSubmit={handleSubmit}>
          <AuroraInput
            fullWidth
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            margin="normal"
            disabled={loading}
          />

          <AuroraInput
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            margin="normal"
            disabled={loading}
          />

          <AuroraBox sx={{ textAlign: 'right', mt: 1, mb: 2 }}>
            <AuroraLink
              component="button"
              type="button"
              variant="body2"
              onClick={onForgotPassword}
              sx={{ cursor: 'pointer' }}
            >
              Forgot password?
            </AuroraLink>
          </AuroraBox>

          <AuroraBox sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
            <AuroraLink
              component="button"
              type="button"
              variant="body2"
              onClick={() => {
                localStorage.removeItem('tenantId');
                navigate('/');
              }}
              sx={{ cursor: 'pointer' }}
            >
              Switch to different client
            </AuroraLink>
          </AuroraBox>

          <AuroraButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<AuroraLoginIcon />}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </AuroraButton>
        </form>
      </AuroraCard>
    </AuroraBox>
  );
};

export default Login;
