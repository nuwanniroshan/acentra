import { SuperAdminDashboard } from "./SuperAdminDashboard";
import { AdminDashboard } from "./AdminDashboard";
import { Dashboard } from "./Dashboard";
import { RecruiterDashboard } from "./RecruiterDashboard";
import { HRDashboard } from "./HRDashboard";
import { HiringManagerDashboard } from "./HiringManagerDashboard";
import { UserRole } from "@acentra/shared-types";


export function DashboardRouter() {
  const userString = localStorage.getItem("user");
  if (!userString) return <Dashboard />;

  const user = JSON.parse(userString);
  const role = user.role?.toLowerCase();

  // Super Admin gets SuperAdminDashboard
  if (role === UserRole.SUPER_ADMIN) {
    return <SuperAdminDashboard />;
  }

  // Admin gets AdminDashboard
  if (role === UserRole.ADMIN) {
    return <AdminDashboard />;
  }

  // HR
  if (role === UserRole.HR) {
    return <HRDashboard />;
  }

  // Hiring Manager / EM
  if (role === UserRole.HIRING_MANAGER) {
    return <HiringManagerDashboard />;
  }

  // Recruiter
  if (role === UserRole.RECRUITER) {
    return <RecruiterDashboard />;
  }

  return <Dashboard />;
}

