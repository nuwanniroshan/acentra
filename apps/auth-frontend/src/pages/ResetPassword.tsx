import React, { useState } from 'react';
import { requestAuth } from '../utils/api';
import {
  AuroraBox,
  AuroraCard,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraAlert,
  AuroraLockIcon,
  AuroraCheckCircleIcon,
} from '@acentra/aurora-design-system';

interface ResetPasswordProps {
  token: string;
  onSuccess?: () => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({
  token,
  onSuccess,
  onBack,
  title = 'Reset Your Password',
  subtitle = 'Enter your new password below',
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await requestAuth('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      
      setSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
            textAlign: 'center',
          }}
        >
          <AuroraBox sx={{ mb: 3 }}>
            <AuroraCheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <AuroraTypography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Password Reset Successful
            </AuroraTypography>
            <AuroraTypography variant="body1" color="text.secondary">
              Your password has been successfully reset. You can now log in with your new password.
            </AuroraTypography>
          </AuroraBox>

          <AuroraButton
            fullWidth
            variant="contained"
            onClick={onBack}
            sx={{ mt: 2 }}
          >
            Go to Login
          </AuroraButton>
        </AuroraCard>
      </AuroraBox>
    );
  }

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
            type="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            autoFocus
            margin="normal"
            disabled={loading}
            placeholder="Enter new password"
            helperText="Password must be at least 8 characters"
          />

          <AuroraInput
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            margin="normal"
            disabled={loading}
            placeholder="Confirm new password"
          />

          <AuroraButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<AuroraLockIcon />}
            disabled={loading}
            sx={{ 
              mt: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </AuroraButton>
        </form>
      </AuroraCard>
    </AuroraBox>
  );
};

export default ResetPassword;