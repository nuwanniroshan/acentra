import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { auroraTheme } from '@acentra/aurora-design-system';

function App() {
  return (
    <ThemeProvider theme={auroraTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPasswordWrapper />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Wrapper to extract token from URL params
function ResetPasswordWrapper() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || '';
  
  return <ResetPassword token={token} />;
}

export default App;