import { useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { DashboardRouter } from "./pages/DashboardRouter";
import { CreateJob } from "./pages/CreateJob";
import { EditJob } from "./pages/EditJob";
import { JobDetails } from "./pages/JobDetails";
import { AdminUsers } from "./pages/AdminUsers";
import { Settings } from "./pages/Settings";
import { AddCandidate } from "./pages/AddCandidate";
import { Candidates } from "./pages/Candidates";
import { Jobs } from "./pages/Jobs";
import { Login } from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ComingSoon from "./components/ComingSoon";

import { SnackbarProvider } from "@/context/SnackbarContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider as CustomThemeProvider, useTheme } from "@/context/ThemeContext";
import { Layout } from "@/components/Layout";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";

function TenantLoginWrapper() {
  const { tenant } = useParams<{ tenant: string }>();

  return (
    <Login
      onSuccess={() => window.location.href = `/${tenant}/dashboard`}
    />
  );
}

function RootRedirect() {
  const tenantId = localStorage.getItem('tenantId');
  if (tenantId && tenantId !== 'null' && tenantId !== 'undefined') {
    return <Navigate to={`/${tenantId}`} replace />;
  }
  return <LandingPage />;
}

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
          <SnackbarProvider>
            <NotificationProvider>
                <Routes>
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/:tenant">
                    <Route
                      index
                      element={<TenantLoginWrapper />}
                    />
                    <Route path="dashboard" element={<Layout><DashboardRouter /></Layout>} />
                    <Route path="shortlist/jobs" element={<Layout><Jobs /></Layout>} />
                    <Route path="shortlist/jobs/:id" element={<Layout><JobDetails /></Layout>} />
                    <Route path="shortlist/jobs/:id/add-candidate" element={<Layout><AddCandidate /></Layout>} />
                    <Route path="shortlist/jobs/:id/edit" element={<Layout><EditJob /></Layout>} />
                    <Route path="shortlist/candidates" element={<Layout><Candidates /></Layout>} />
                    <Route path="create-job" element={<Layout><CreateJob /></Layout>} />
                    <Route path="payroll/main" element={<Layout><ComingSoon moduleName="Payroll" /></Layout>} />
                    <Route path="admin/users" element={<Layout><AdminUsers /></Layout>} />
                    <Route path="settings" element={<Layout><Settings /></Layout>} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Route>
                </Routes>
            </NotificationProvider>
          </SnackbarProvider>
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
