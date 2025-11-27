import { SuperAdminDashboard } from "./SuperAdminDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { Dashboard } from "./Dashboard";

export function DashboardRouter() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  // Super Admin gets SuperAdminDashboard
  if (role === "super_admin") {
    return <SuperAdminDashboard />;
  }

  // Admin gets AdminDashboard
  if (role === "admin") {
    return <AdminDashboard />;
  }

  // Manager, Recruiter, HR get the current Dashboard
  // (engineering_manager, recruiter, hr)
  return <Dashboard />;
}