import { SuperAdminDashboard } from "./SuperAdminDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { Dashboard } from "./Dashboard";
import { RecruiterDashboard } from "./RecruiterDashboard";
import { UserRole } from "@acentra/shared-types";


export function DashboardRouter() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  // Super Admin gets SuperAdminDashboard
  if (role === UserRole.SUPER_ADMIN || role?.toLowerCase() === UserRole.SUPER_ADMIN) {
    return <SuperAdminDashboard />;
  }

  // Admin gets AdminDashboard
  if (role === UserRole.ADMIN || role?.toLowerCase() === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  // Manager, Recruiter, HR
  if (role === UserRole.RECRUITER || role === UserRole.HR) {
    return <RecruiterDashboard />;
  }

  return <Dashboard />;
}

