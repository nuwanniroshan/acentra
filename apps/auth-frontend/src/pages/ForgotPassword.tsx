import React, { useState } from 'react';
import { requestAuth } from '../utils/api';
import {
  AuroraBox,
  AuroraCard,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraAlert,
  AuroraLink,
  AuroraEmailIcon,
  AuroraArrowBackIcon,
} from '@acentra/aurora-design-system';

interface ForgotPasswordProps {
  onBack?: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onBack,
  onSuccess,
  title = 'Reset Password',
  subtitle = 'Enter your email address and we\'ll send you a link to reset your password',
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestAuth('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
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
            <AuroraEmailIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <AuroraTypography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Check Your Email
            </AuroraTypography>
            <AuroraTypography variant="body1" color="text.secondary">
              We've sent a password reset link to <strong>{email}</strong>
            </AuroraTypography>
          </AuroraBox>

          <AuroraAlert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            If you don't see the email, check your spam folder or try again.
          </AuroraAlert>

          <AuroraButton
            fullWidth
            variant="outlined"
            startIcon={<AuroraArrowBackIcon />}
            onClick={onBack}
            sx={{ mt: 2 }}
          >
            Back to Login
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
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
            margin="normal"
            disabled={loading}
            placeholder="Enter your email address"
          />

          <AuroraButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<AuroraEmailIcon />}
            disabled={loading}
            sx={{ 
              mt: 3,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </AuroraButton>

          <AuroraBox sx={{ textAlign: 'center', mt: 3 }}>
            <AuroraButton
              variant="text"
              onClick={onBack}
              startIcon={<AuroraArrowBackIcon />}
              sx={{ textTransform: 'none' }}
            >
              Back to Login
            </AuroraButton>
          </AuroraBox>
        </form>
      </AuroraCard>
    </AuroraBox>
  );
};

export default ForgotPassword;