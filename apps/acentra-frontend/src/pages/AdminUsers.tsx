import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTenant } from "@/context/TenantContext";
import { usersService } from "@/services/usersService";
import { authService } from "@/services/authService";
import { useSnackbar } from "@/context/SnackbarContext";
import { useAuth } from "@/context/AuthContext";
import {
  AuroraBox,
  AuroraCard,
  AuroraCardContent,
  AuroraTypography,
  AuroraTable,
  AuroraTableBody,
  AuroraTableCell,
  AuroraTableContainer,
  AuroraTableHead,
  AuroraTableRow,
  AuroraSelect,
  AuroraMenuItem,
  AuroraIconButton,
  AuroraButton,
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraInput,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraChip,
  AuroraSkeleton,
  AuroraAvatar,
  AuroraDeleteIcon,
  AuroraAddIcon,
  AuroraBlockIcon,
  AuroraCheckCircleIcon,
  AuroraSearchIcon,
  AuroraEditIcon,
  AuroraCameraAltIcon,
  AuroraGrid,
  AuroraLiveIconUsers,
  alpha,
} from "@acentra/aurora-design-system";
import { ActionPermission, UserRole } from "@acentra/shared-types";
import { API_BASE_URL } from "@/services/clients";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  profile_picture?: string;
  job_title?: string;
  employee_number?: string;
  manager_id?: string;
  is_active: boolean;
}

interface AdminUsersProps {
  embedded?: boolean;
}

export function AdminUsers({ embedded = false }: AdminUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState(UserRole.HIRING_MANAGER);
  const [newUserName, setNewUserName] = useState("");
  const [newUserJobTitle, setNewUserJobTitle] = useState("");
  const [newUserEmployeeNumber, setNewUserEmployeeNumber] = useState("");
  const [newUserManagerId, setNewUserManagerId] = useState("");
  const [newUserAddress, setNewUserAddress] = useState("");
  const [newUserAvatar, setNewUserAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { showSnackbar } = useSnackbar();

  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const tenant = useTenant();
  const theme = useTheme();

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.job_title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await usersService.deleteUser(id);
      loadUsers();
      showSnackbar("User deleted successfully", "success");
    } catch {
      showSnackbar("Failed to delete user", "error");
    }
  };



  const handleToggleActive = async (id: string) => {
    try {
      await usersService.toggleUserActive(id);
      loadUsers();
      showSnackbar("User status updated", "success");
    } catch {
      showSnackbar("Failed to update user status", "error");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar("Image size must be less than 2MB", "error");
        return;
      }
      setNewUserAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetUserName, setResetUserName] = useState("");

  const handleResetPassword = async (user: User) => {
    if (!confirm(`Are you sure you want to reset password for ${user.name || user.email}?`)) return;

    try {
      // Call backend without password to trigger auto-generation
      const response = await usersService.adminResetPassword(user.id);
      if (response.success && response.data?.password) {
        setResetUserName(user.name || user.email);
        setResetPasswordValue(response.data.password);
        setResetPasswordOpen(true);
      } else {
        showSnackbar("Password reset, but no new password returned (check logs)", "warning");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Failed to reset password", "error");
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await authService.register({
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole as UserRole,
        name: newUserName,
        job_title: newUserJobTitle,
        employee_number: newUserEmployeeNumber,
        manager_id: newUserManagerId || undefined,
        address: newUserAddress,
      });

      // If there is an avatar, upload it
      if (newUserAvatar && response.data?.id) {
        try {
          await usersService.uploadProfilePicture(response.data.id, newUserAvatar);
        } catch (uploadErr) {
          console.error("Failed to upload profile picture", uploadErr);
          showSnackbar("User created but profile picture upload failed", "warning");
        }
      }

      showSnackbar("User created successfully", "success");

      // If backend generated a password (and we didn't provide one, or even if we did but backend prefers returning), 
      // check response.data.generatedPassword
      if (response.data?.generatedPassword) {
        setResetUserName(newUserName || newUserEmail);
        setResetPasswordValue(response.data.generatedPassword);
        setResetPasswordOpen(true);
      }

      setOpenAddModal(false);

      // Reset form
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserName("");
      setNewUserJobTitle("");
      setNewUserEmployeeNumber("");
      setNewUserManagerId("");
      setNewUserAddress("");
      setNewUserAvatar(null);
      setAvatarPreview(null);

      loadUsers();
    } catch (err: any) {
      showSnackbar(err.message || "Failed to create user", "error");
    }
  };

  return (
    <AuroraBox sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      {!embedded && (
        <DashboardHeader
          title="Staff Management"
          subtitle="Manage your organization's workforce, roles, and permissions."
        />
      )}

      <AuroraBox
        sx={{
          maxWidth: 1600,
          mx: "auto",
          px: { xs: 3, md: 6 },
          position: "relative",
          zIndex: 2,
          mt: embedded ? 0 : 0
        }}
      >
        {!embedded && (
          <AuroraGrid container spacing={3} sx={{ mb: 6 }}>
            <AuroraGrid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Total Staff"
                value={users.length}
                loading={loading}
              />
            </AuroraGrid>
            <AuroraGrid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Active Members"
                value={users.filter(u => u.is_active).length}
                trend="Healthy"
                loading={loading}
              />
            </AuroraGrid>
            <AuroraGrid size={{ xs: 12, md: 4 }}>
              <StatCard
                label="Admins & HR"
                value={users.filter(u => u.role === UserRole.ADMIN || u.role === UserRole.HR).length}
                loading={loading}
              />
            </AuroraGrid>
          </AuroraGrid>
        )}

        <AuroraBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexDirection: { xs: "column", sm: "row" },
            gap: 2
          }}
        >
          <AuroraTypography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
            {searchQuery ? `Search results for "${searchQuery}"` : "All Staff Members"}
          </AuroraTypography>
          <AuroraBox sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: "100%", sm: "auto" } }}>
            <AuroraInput
              size="small"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <AuroraSearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
              }}
              sx={{
                width: { xs: "100%", sm: 250 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  bgcolor: "background.paper"
                }
              }}
            />
            <AuroraButton
              variant="contained"
              startIcon={<AuroraAddIcon />}
              onClick={() => setOpenAddModal(true)}
              sx={{
                borderRadius: 2.5,
                px: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                whiteSpace: "nowrap"
              }}
            >
              Add Staff
            </AuroraButton>
          </AuroraBox>
        </AuroraBox>

        <AuroraCard
          sx={{
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            overflow: "hidden",
            bgcolor: "background.paper"
          }}
        >
          <AuroraCardContent sx={{ p: 0 }}>
            <AuroraTableContainer>
              <AuroraTable>
                <AuroraTableHead sx={{ bgcolor: alpha("#f8fafc", 0.5) }}>
                  <AuroraTableRow>
                    <AuroraTableCell sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem", py: 2.5, pl: 3 }}>Staff Member</AuroraTableCell>
                    <AuroraTableCell sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem" }}>Designation</AuroraTableCell>
                    <AuroraTableCell sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem" }}>System Role</AuroraTableCell>
                    <AuroraTableCell sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem" }}>Status</AuroraTableCell>
                    <AuroraTableCell align="right" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.75rem", pr: 3 }}>Actions</AuroraTableCell>
                  </AuroraTableRow>
                </AuroraTableHead>
                <AuroraTableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <AuroraTableRow key={index}>
                        <AuroraTableCell colSpan={5} sx={{ px: 3 }}>
                          <AuroraSkeleton height={60} sx={{ borderRadius: 2 }} />
                        </AuroraTableCell>
                      </AuroraTableRow>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <AuroraTableRow>
                      <AuroraTableCell colSpan={5} align="center" sx={{ py: 12 }}>
                        <AuroraBox sx={{ textAlign: 'center' }}>
                          <AuroraLiveIconUsers width={64} height={64} stroke="#cbd5e1" style={{ marginBottom: 16 }} />
                          <AuroraTypography
                            variant="h6"
                            sx={{ fontWeight: 700, color: "text.secondary", mb: 1 }}
                          >
                            No matching staff found
                          </AuroraTypography>
                          <AuroraTypography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                            Try adjusting your search query or add a new member.
                          </AuroraTypography>
                          <AuroraButton
                            variant="outlined"
                            startIcon={<AuroraAddIcon />}
                            onClick={() => setOpenAddModal(true)}
                            sx={{ borderRadius: 2 }}
                          >
                            Add Staff Member
                          </AuroraButton>
                        </AuroraBox>
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <AuroraTableRow
                        key={user.id}
                        hover
                        onClick={() => navigate(`/${tenant}/people/staff/${user.id}`)}
                        sx={{
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          "&:hover": { bgcolor: alpha("#3b82f6", 0.02) }
                        }}
                      >
                        <AuroraTableCell sx={{ pl: 3 }}>
                          <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                            <AuroraAvatar
                              sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2.5,
                                bgcolor: 'primary.main',
                                fontWeight: 800,
                                fontSize: "1rem"
                              }}
                              src={user.profile_picture ? `${API_BASE_URL}/api/${user.profile_picture}` : undefined}
                            >
                              {(user.name || user.email).charAt(0).toUpperCase()}
                            </AuroraAvatar>
                            <AuroraBox>
                              <AuroraTypography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 0.25 }}>
                                {user.name || "N/A"}
                              </AuroraTypography>
                              <AuroraTypography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                {user.email}
                              </AuroraTypography>
                            </AuroraBox>
                          </AuroraBox>
                        </AuroraTableCell>
                        <AuroraTableCell>
                          <AuroraBox>
                            <AuroraTypography variant="body2" sx={{ fontWeight: 700, mb: 0.25 }}>
                              {user.job_title || "N/A"}
                            </AuroraTypography>
                            <AuroraTypography variant="caption" sx={{ color: "text.disabled", fontWeight: 600 }}>
                              ID: {user.employee_number || "N/A"}
                            </AuroraTypography>
                          </AuroraBox>
                        </AuroraTableCell>
                        <AuroraTableCell>
                          <AuroraChip
                            label={user.role.replace('_', ' ').toLowerCase()}
                            status={user.role === UserRole.ADMIN ? "error" : user.role === UserRole.HR ? "warning" : "neutral"}
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              borderRadius: 2,
                              textTransform: 'capitalize',
                              borderWidth: 1.5
                            }}
                          />
                        </AuroraTableCell>
                        <AuroraTableCell>
                          <AuroraChip
                            label={user.is_active ? "Active" : "Disabled"}
                            status={user.is_active ? "success" : "neutral"}
                            sx={{
                              fontWeight: 700,
                              borderRadius: 2
                            }}
                          />
                        </AuroraTableCell>
                        <AuroraTableCell align="right" sx={{ pr: 3 }}>
                          <AuroraBox
                            sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Reset Password Action */}
                            {hasPermission(ActionPermission.MANAGE_USER_ROLES) && (
                              <AuroraButton
                                size="small"
                                variant="text"
                                onClick={(e) => { e.stopPropagation(); handleResetPassword(user); }}
                                sx={{ minWidth: 'auto', px: 1 }}
                              >
                                Reset Pass
                              </AuroraButton>
                            )}

                            {hasPermission(ActionPermission.MANAGE_USER_ROLES) && (
                              <AuroraIconButton
                                onClick={() => { }}
                                title="Edit User"
                                sx={{
                                  borderRadius: 2,
                                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                                  color: 'primary.main',
                                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                }}
                                size="small"
                              >
                                <AuroraEditIcon fontSize="small" />
                              </AuroraIconButton>
                            )}
                            {hasPermission(ActionPermission.MANAGE_USER_STATUS) && (
                              <AuroraIconButton
                                onClick={() => handleToggleActive(user.id)}
                                title={user.is_active ? "Disable User" : "Enable User"}
                                sx={{
                                  borderRadius: 2,
                                  bgcolor: user.is_active ? alpha(theme.palette.warning.main, 0.05) : alpha(theme.palette.success.main, 0.05),
                                  color: user.is_active ? 'warning.main' : 'success.main',
                                  '&:hover': { bgcolor: user.is_active ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.success.main, 0.1) }
                                }}
                                size="small"
                              >
                                {user.is_active ? (
                                  <AuroraBlockIcon fontSize="small" />
                                ) : (
                                  <AuroraCheckCircleIcon fontSize="small" />
                                )}
                              </AuroraIconButton>
                            )}
                            {hasPermission(ActionPermission.DELETE_USERS) && (
                              <AuroraIconButton
                                onClick={() => handleDelete(user.id)}
                                title="Delete User"
                                sx={{
                                  borderRadius: 2,
                                  bgcolor: alpha(theme.palette.error.main, 0.05),
                                  color: 'error.main',
                                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                                }}
                                size="small"
                              >
                                <AuroraDeleteIcon fontSize="small" />
                              </AuroraIconButton>
                            )}
                          </AuroraBox>
                        </AuroraTableCell>
                      </AuroraTableRow>
                    ))
                  )}
                </AuroraTableBody>
              </AuroraTable>
            </AuroraTableContainer>
          </AuroraCardContent>
        </AuroraCard>
      </AuroraBox>

      {/* Add User Dialog */}
      <AuroraDialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth>
        <AuroraDialogTitle>Add New Staff Member</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, pt: 1 }}>
            <AuroraBox sx={{ position: 'relative' }}>
              <AuroraAvatar
                src={avatarPreview || undefined}
                sx={{ width: 100, height: 100, border: '2px solid', borderColor: 'divider' }}
              >
                {newUserName ? newUserName.charAt(0).toUpperCase() : <AuroraCameraAltIcon />}
              </AuroraAvatar>
              <AuroraIconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  '&:hover': { bgcolor: 'background.paper', opacity: 0.9 },
                  border: '1px solid',
                  borderColor: 'divider',
                  width: 32,
                  height: 32,
                }}
                size="small"
              >
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <AuroraCameraAltIcon sx={{ fontSize: 18 }} />
              </AuroraIconButton>
            </AuroraBox>
            <AuroraTypography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Upload profile picture (Max 2MB)
            </AuroraTypography>
          </AuroraBox>

          <AuroraBox sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <AuroraInput
              fullWidth
              label="Full Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
            <AuroraInput
              fullWidth
              label="Email"
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <AuroraInput
              fullWidth
              label="Password (Optional)"
              placeholder="Leave blank to auto-generate"
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
            />
            <AuroraFormControl fullWidth>
              <AuroraInputLabel>Role</AuroraInputLabel>
              <AuroraSelect
                value={newUserRole}
                label="Role"
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
              >
                <AuroraMenuItem value={UserRole.ADMIN}>Admin</AuroraMenuItem>
                <AuroraMenuItem value={UserRole.HR}>HR</AuroraMenuItem>
                <AuroraMenuItem value={UserRole.HIRING_MANAGER}>
                  Hiring Manager
                </AuroraMenuItem>
                <AuroraMenuItem value={UserRole.RECRUITER}>Recruiter</AuroraMenuItem>
                <AuroraMenuItem value={UserRole.EMPLOYEE}>Employee</AuroraMenuItem>
              </AuroraSelect>
            </AuroraFormControl>
            <AuroraInput
              fullWidth
              label="Job Title"
              value={newUserJobTitle}
              onChange={(e) => setNewUserJobTitle(e.target.value)}
            />
            <AuroraInput
              fullWidth
              label="Employee Number"
              value={newUserEmployeeNumber}
              onChange={(e) => setNewUserEmployeeNumber(e.target.value)}
            />
            <AuroraFormControl fullWidth>
              <AuroraInputLabel>Reporting Manager</AuroraInputLabel>
              <AuroraSelect
                value={newUserManagerId}
                label="Reporting Manager"
                onChange={(e) => setNewUserManagerId(e.target.value as string)}
              >
                <AuroraMenuItem value="">None</AuroraMenuItem>
                {users.map(u => (
                  <AuroraMenuItem key={u.id} value={u.id}>
                    {u.name || u.email}
                  </AuroraMenuItem>
                ))}
              </AuroraSelect>
            </AuroraFormControl>
            <AuroraInput
              fullWidth
              label="Address"
              value={newUserAddress}
              onChange={(e) => setNewUserAddress(e.target.value)}
              sx={{ gridColumn: 'span 2' }}
              multiline
              rows={2}
            />
          </AuroraBox>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setOpenAddModal(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton onClick={handleAddUser} variant="contained">
            Create Staff Member
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

      {/* Reset Password Success Dialog */}
      <AuroraDialog open={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} maxWidth="xs" fullWidth>
        <AuroraDialogTitle>Password Generated</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraTypography variant="body1" sx={{ mb: 2 }}>
            A new password has been generated for <strong>{resetUserName}</strong>.
          </AuroraTypography>

          <AuroraBox
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              fontFamily: 'monospace',
              fontSize: '1.2rem',
              textAlign: 'center',
              mb: 2,
              userSelect: 'all'
            }}
          >
            {resetPasswordValue}
          </AuroraBox>

          <AuroraTypography variant="caption" color="text.secondary">
            Please copy this password and share it with the user. It will not be shown again.
          </AuroraTypography>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => {
            navigator.clipboard.writeText(resetPasswordValue);
            showSnackbar("Password copied to clipboard", "success");
          }}>
            Copy Password
          </AuroraButton>
          <AuroraButton onClick={() => setResetPasswordOpen(false)} variant="contained">
            Done
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>

    </AuroraBox>
  );
}
