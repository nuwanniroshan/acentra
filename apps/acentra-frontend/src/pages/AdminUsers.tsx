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
  AuroraDeleteIcon,
  AuroraArrowBackIcon,
  AuroraAddIcon,
  AuroraBlockIcon,
  AuroraCheckCircleIcon,
} from "@acentra/aurora-design-system";
import { useNavigate } from "react-router-dom";
import { UserRole, ActionPermission } from "@acentra/shared-types";

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
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

  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState(UserRole.HIRING_MANAGER);
  const [newUserName, setNewUserName] = useState("");
  const [newUserJobTitle, setNewUserJobTitle] = useState("");
  const [newUserEmployeeNumber, setNewUserEmployeeNumber] = useState("");
  const [newUserManagerId, setNewUserManagerId] = useState("");
  const [newUserAddress, setNewUserAddress] = useState("");

  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

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

  const handleRoleChange = async (id: string, newRole: UserRole) => {
    try {
      await usersService.updateUserRole(id, newRole);
      loadUsers();
      showSnackbar("Role updated successfully", "success");
    } catch (err) {
      showSnackbar("Failed to update role", "error");
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

  const handleAddUser = async () => {
    try {
      await authService.register({
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole as UserRole,
        name: newUserName,
        job_title: newUserJobTitle,
        employee_number: newUserEmployeeNumber,
        manager_id: newUserManagerId || undefined,
        address: newUserAddress,
      });
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
      {!embedded && (
        <AuroraIconButton
          onClick={() => navigate("/dashboard")}
          sx={{
            mb: 2,
            borderRadius: 1,
            width: 40,
            height: 40,
          }}
        >
          <AuroraArrowBackIcon />
        </AuroraIconButton>
      )}

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
        <AuroraButton
          startIcon={<AuroraAddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Add Staff Member
        </AuroraButton>
      </AuroraBox>

      <AuroraCard variant={embedded ? "outlined" : "elevation"}>
        <AuroraCardContent sx={{ p: 0 }}>
          <AuroraTableContainer>
            <AuroraTable>
              <AuroraTableHead>
                <AuroraTableRow>
                  <AuroraTableCell>Name</AuroraTableCell>
                  <AuroraTableCell>Email</AuroraTableCell>
                  <AuroraTableCell>Job Title</AuroraTableCell>
                  <AuroraTableCell>Employee #</AuroraTableCell>
                  <AuroraTableCell>Role</AuroraTableCell>
                  <AuroraTableCell>Status</AuroraTableCell>
                  <AuroraTableCell align="right">Actions</AuroraTableCell>
                </AuroraTableRow>
              </AuroraTableHead>
              <AuroraTableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <AuroraTableRow key={index}>
                      <AuroraTableCell colSpan={7}>
                        <AuroraSkeleton />
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ))
                ) : users.length === 0 ? (
                  <AuroraTableRow>
                    <AuroraTableCell colSpan={7} align="center" sx={{ py: 8 }}>
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
                  users.map((user) => (
                    <AuroraTableRow key={user.id}>
                      <AuroraTableCell>
                        <AuroraTypography variant="subtitle2" fontWeight="bold">
                          {user.name || "N/A"}
                        </AuroraTypography>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraTypography variant="body2">
                          {user.email}
                        </AuroraTypography>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraTypography variant="body2">
                          {user.job_title || "N/A"}
                        </AuroraTypography>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraTypography variant="body2" color="text.secondary">
                          {user.employee_number || "N/A"}
                        </AuroraTypography>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraSelect
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value as UserRole)
                          }
                          size="small"
                          sx={{ minWidth: 150 }}
                          disabled={!hasPermission(ActionPermission.MANAGE_USER_ROLES)}
                        >
                          <AuroraMenuItem value={UserRole.ADMIN}>Admin</AuroraMenuItem>
                          <AuroraMenuItem value={UserRole.HR}>HR</AuroraMenuItem>
                          <AuroraMenuItem value={UserRole.HIRING_MANAGER}>
                            Hiring Manager
                          </AuroraMenuItem>
                          <AuroraMenuItem value={UserRole.RECRUITER}>
                            Recruiter
                          </AuroraMenuItem>
                          <AuroraMenuItem value={UserRole.EMPLOYEE}>
                            Employee
                          </AuroraMenuItem>
                        </AuroraSelect>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraChip
                          label={user.is_active ? "Active" : "Disabled"}
                          color={user.is_active ? "success" : "default"}
                          size="small"
                        />
                      </AuroraTableCell>
                      <AuroraTableCell align="right">
                        {hasPermission(ActionPermission.MANAGE_USER_STATUS) && (
                          <AuroraIconButton
                            onClick={() => handleToggleActive(user.id)}
                            title={
                              user.is_active ? "Disable User" : "Enable User"
                            }
                            color={user.is_active ? "default" : "success"}
                            sx={{
                              borderRadius: 1,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {user.is_active ? (
                              <AuroraBlockIcon />
                            ) : (
                              <AuroraCheckCircleIcon />
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
                              width: 40,
                              height: 40,
                            }}
                          >
                            <AuroraDeleteIcon />
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
          <AuroraBox sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
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
