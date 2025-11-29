import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuroraSnackbar, AuroraAlert } from '@acentra/aurora-design-system';

type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertSeverity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('info');

  const showSnackbar = useCallback((msg: string, sev: AlertSeverity = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <AuroraSnackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <AuroraAlert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </AuroraAlert>
      </AuroraSnackbar>
    </SnackbarContext.Provider>
  );
};