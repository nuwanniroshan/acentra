import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
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
import { CssBaseline } from "@mui/material";

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
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
