import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardRouter } from "./pages/DashboardRouter";
import { CreateJob } from "./pages/CreateJob";
import { EditJob } from "./pages/EditJob";
import { JobDetails } from "./pages/JobDetails";
import { AdminUsers } from "./pages/AdminUsers";
import { Settings } from "./pages/Settings";
import { AddCandidate } from "./pages/AddCandidate";
import { Candidates } from "./pages/Candidates";
import { SnackbarProvider } from "./context/SnackbarContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider as CustomThemeProvider, useTheme } from "./context/ThemeContext";
import { Layout } from "./components/Layout";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";

// Lazy load the federated components
const FederatedLogin = lazy(() => import("auth_frontend/Login"));
const FederatedAuthProvider = lazy(() => import("auth_frontend/AuthProvider").then(module => ({ default: module.AuthProvider })));

function AppContent() {
  const { theme, loadUserPreferences } = useTheme();
  
  // Load user preferences on app initialization if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.id) {
          loadUserPreferences(userData.id);
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, [loadUserPreferences]);
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      }>
        <FederatedAuthProvider>
          <SnackbarProvider>
            <NotificationProvider>
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <FederatedLogin
                        onSuccess={() => window.location.href = '/dashboard'}
                      />
                    }
                  />
                  <Route path="/dashboard" element={<Layout><DashboardRouter /></Layout>} />
                  <Route path="/create-job" element={<Layout><CreateJob /></Layout>} />
                  <Route path="/jobs/:id" element={<Layout><JobDetails /></Layout>} />
                  <Route path="/jobs/:id/add-candidate" element={<Layout><AddCandidate /></Layout>} />
                  <Route path="/jobs/:id/edit" element={<Layout><EditJob /></Layout>} />
                  <Route path="/admin/users" element={<Layout><AdminUsers /></Layout>} />
                  <Route path="/settings" element={<Layout><Settings /></Layout>} />
                  <Route path="/candidates" element={<Layout><Candidates /></Layout>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </BrowserRouter>
            </NotificationProvider>
          </SnackbarProvider>
        </FederatedAuthProvider>
      </Suspense>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;
