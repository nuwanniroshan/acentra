import { useEffect, Suspense } from "react";
import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import { DashboardRouter } from "./pages/DashboardRouter";
import { CreateJob } from "./pages/CreateJob";
import { EditJob } from "./pages/EditJob";
import { JobDetails } from "./pages/JobDetails";
import { AdminUsers } from "./pages/AdminUsers";
import { Settings } from "./pages/Settings";
import { AddCandidate } from "./pages/AddCandidate";
import { Candidates } from "./pages/Candidates";
import { Jobs } from "./pages/Jobs";
import { PendingJobApproval } from "./pages/PendingJobApproval";
import { Login } from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ComingSoon from "./components/ComingSoon";
import { NotificationsPage } from "./pages/NotificationsPage";
import { PublicLayout } from "./layouts/PublicLayout";
import { GlobalJobBoard } from "./pages/public/GlobalJobBoard";
import { PublicJobDetails } from "./pages/public/PublicJobDetails";
import { EmployeeDetails } from "./pages/EmployeeDetails";

import { SnackbarProvider } from "@/context/SnackbarContext";
import { NotificationProvider } from "@/context/NotificationContext";
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from "@/context/ThemeContext";
import { Layout } from "@/components/Layout";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";

function TenantLoginWrapper() {
  const navigate = useNavigate();
  const { tenant } = useParams<{ tenant: string }>();

  return (
    <Login onSuccess={() => navigate(`/${tenant}/dashboard`)} />
  );
}

function RootRedirect() {
  const tenantId = localStorage.getItem("tenantId");
  if (tenantId && tenantId !== "null" && tenantId !== "undefined") {
    return <Navigate to={`/${tenantId}`} replace />;
  }
  return <LandingPage />;
}

function AppContent() {
  const { theme, loadUserPreferences } = useTheme();
  const navigate = useNavigate();

  // Listen for session expiration events from axios interceptor
  useEffect(() => {
    const handleSessionExpired = () => {
      navigate("/");
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [navigate]);

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
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <SnackbarProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              {/* Public Careers Routes */}
              {/* Public Careers Routes */}
              <Route path="/public" element={<PublicLayout />}>
                <Route path="careers" element={<GlobalJobBoard />} />
                <Route path="careers/:tenantId" element={<ComingSoon moduleName="Tenant Job Board" />} />
                <Route path="careers/:tenantId/jobs/:jobId" element={<PublicJobDetails />} />
              </Route>

              <Route path="/:tenant">
                <Route index element={<TenantLoginWrapper />} />
                <Route
                  path="dashboard"
                  element={
                    <Layout>
                      <DashboardRouter />
                    </Layout>
                  }
                />
                <Route
                  path="ats/jobs"
                  element={
                    <Layout>
                      <Jobs />
                    </Layout>
                  }
                />
                <Route
                  path="ats/jobs/:id"
                  element={
                    <Layout>
                      <JobDetails />
                    </Layout>
                  }
                />
                <Route
                  path="ats/jobs/:id/approval"
                  element={
                    <Layout>
                      <PendingJobApproval />
                    </Layout>
                  }
                />
                <Route
                  path="ats/jobs/:id/add-candidate"
                  element={
                    <Layout>
                      <AddCandidate />
                    </Layout>
                  }
                />
                <Route
                  path="ats/jobs/:id/edit"
                  element={
                    <Layout>
                      <EditJob />
                    </Layout>
                  }
                />
                <Route
                  path="ats/candidates"
                  element={
                    <Layout>
                      <Candidates />
                    </Layout>
                  }
                />
                <Route
                  path="create-job"
                  element={
                    <Layout>
                      <CreateJob />
                    </Layout>
                  }
                />

                <Route
                  path="payroll/main"
                  element={
                    <Layout>
                      <ComingSoon moduleName="Payroll" />
                    </Layout>
                  }
                />
                <Route
                  path="time-tracking/main"
                  element={
                    <Layout>
                      <ComingSoon moduleName="Time Tracking" />
                    </Layout>
                  }
                />
                <Route
                  path="people/main"
                  element={
                    <Layout>
                      <ComingSoon moduleName="People" />
                    </Layout>
                  }
                />
                <Route
                  path="people/staff"
                  element={
                    <Layout>
                      <AdminUsers />
                    </Layout>
                  }
                />
                <Route
                  path="people/staff/:id"
                  element={
                    <Layout>
                      <EmployeeDetails />
                    </Layout>
                  }
                />
                <Route
                  path="admin/users"
                  element={<Navigate to="../people/staff" replace />}
                />
                <Route
                  path="settings/*"
                  element={
                    <Layout>
                      <Settings />
                    </Layout>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <Layout>
                      <NotificationsPage />
                    </Layout>
                  }
                />
                <Route
                  path="feedback"
                  element={
                    <Layout>
                      <ComingSoon moduleName="Feedback" />
                    </Layout>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </SnackbarProvider>
      </Suspense>
    </MuiThemeProvider>
  );
}

import { AuthProvider } from "@/context/AuthContext";

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
