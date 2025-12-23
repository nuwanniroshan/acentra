import { useEffect, useState } from "react";
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
} from "@acentra/aurora-design-system";
import { useNavigate } from "react-router-dom";
import { ActionPermission, UserRole } from "@acentra/shared-types";
import { useTenant } from "@/context/TenantContext";
import { API_BASE_URL } from "@/services/clients";

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
  const { showSnackbar } = useSnackbar();
  const { hasPermission } = useAuth();

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
    } catch (err) {
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
    } catch (err) {
      showSnackbar("Failed to delete user", "error");
    }
  };



  const handleToggleActive = async (id: string) => {
    try {
      await usersService.toggleUserActive(id);
      loadUsers();
      showSnackbar("User status updated", "success");
    } catch (err) {
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
    <AuroraBox
      sx={{
        maxWidth: embedded ? "100%" : 1200,
        mx: "auto",
        p: embedded ? 0 : 3,
      }}
    >

      <AuroraBox
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <AuroraTypography variant="h5" fontWeight="bold">
          Staff Management
        </AuroraTypography>
        <AuroraBox sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AuroraInput
            size="small"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <AuroraSearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
            }}
            sx={{ width: 250 }}
          />
          <AuroraButton
            startIcon={<AuroraAddIcon />}
            onClick={() => setOpenAddModal(true)}
          >
            Add Staff Member
          </AuroraButton>
        </AuroraBox>
      </AuroraBox>

      <AuroraCard variant={embedded ? "outlined" : "elevation"}>
        <AuroraCardContent sx={{ p: 0 }}>
          <AuroraTableContainer>
            <AuroraTable>
              <AuroraTableHead>
                <AuroraTableRow>
                  <AuroraTableCell>Staff Member</AuroraTableCell>
                  <AuroraTableCell>Designation</AuroraTableCell>
                  <AuroraTableCell>Role</AuroraTableCell>
                  <AuroraTableCell>Status</AuroraTableCell>
                  <AuroraTableCell align="right">Actions</AuroraTableCell>
                </AuroraTableRow>
              </AuroraTableHead>
              <AuroraTableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <AuroraTableRow key={index}>
                      <AuroraTableCell colSpan={5}>
                        <AuroraSkeleton height={60} />
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ))
                ) : users.length === 0 ? (
                  <AuroraTableRow>
                    <AuroraTableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <AuroraTypography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No staff members found
                      </AuroraTypography>
                      <AuroraButton
                        variant="contained"
                        startIcon={<AuroraAddIcon />}
                        onClick={() => setOpenAddModal(true)}
                      >
                        Add Staff Member
                      </AuroraButton>
                    </AuroraTableCell>
                  </AuroraTableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <AuroraTableRow key={user.id} hover>
                      <AuroraTableCell>
                        <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <AuroraAvatar
                            sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 'bold' }}
                            src={user.profile_picture ? `${API_BASE_URL}/api/${user.profile_picture}` : undefined}
                          >
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </AuroraAvatar>
                          <AuroraBox>
                            <AuroraTypography variant="subtitle2" fontWeight="700" color="text.primary">
                              {user.name || "N/A"}
                            </AuroraTypography>
                            <AuroraTypography variant="caption" color="text.secondary">
                              {user.email}
                            </AuroraTypography>
                          </AuroraBox>
                        </AuroraBox>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraBox>
                          <AuroraTypography variant="body2" fontWeight="500">
                            {user.job_title || "N/A"}
                          </AuroraTypography>
                          <AuroraTypography variant="caption" color="text.secondary">
                            ID: {user.employee_number || "N/A"}
                          </AuroraTypography>
                        </AuroraBox>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraChip
                          label={user.role.replace('_', ' ').toLowerCase()}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 500,
                            bgcolor: 'action.hover',
                            color: 'text.primary',
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        />
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraChip
                          label={user.is_active ? "Active" : "Disabled"}
                          color={user.is_active ? "success" : "default"}
                          size="small"
                        />
                      </AuroraTableCell>
                      <AuroraTableCell align="right">
                        {hasPermission(ActionPermission.MANAGE_USER_ROLES) && (
                          <AuroraIconButton
                            onClick={() => { }} // Implementation out of scope
                            title="Edit User"
                            sx={{
                              borderRadius: 1,
                              width: 32,
                              height: 32,
                              mr: 1
                            }}
                          >
                            <AuroraEditIcon fontSize="small" />
                          </AuroraIconButton>
                        )}
                        {hasPermission(ActionPermission.MANAGE_USER_STATUS) && (
                          <AuroraIconButton
                            onClick={() => handleToggleActive(user.id)}
                            title={
                              user.is_active ? "Disable User" : "Enable User"
                            }
                            color={user.is_active ? "default" : "success"}
                            sx={{
                              borderRadius: 1,
                              width: 32,
                              height: 32,
                              mr: 1
                            }}
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
                            color="error"
                            title="Delete User"
                            sx={{
                              borderRadius: 1,
                              width: 32,
                              height: 32,
                            }}
                          >
                            <AuroraDeleteIcon fontSize="small" />
                          </AuroraIconButton>
                        )}
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ))
                )}
              </AuroraTableBody>
            </AuroraTable>
          </AuroraTableContainer>
        </AuroraCardContent>
      </AuroraCard>

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
              label="Password"
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
    </AuroraBox>
  );
}
