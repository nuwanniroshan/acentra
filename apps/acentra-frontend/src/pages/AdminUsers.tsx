import { useEffect, useState } from "react";
import { usersService } from "@/services/usersService";
import { authService } from "@/services/authService";
import { useSnackbar } from "@/context/SnackbarContext";
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

interface User {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface AdminUsersProps {
  embedded?: boolean;
}

export function AdminUsers({ embedded = false }: AdminUsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("engineering_manager");
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

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

  const handleRoleChange = async (id: string, newRole: string) => {
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
        role: newUserRole,
      });
      showSnackbar("User created successfully", "success");
      setOpenAddModal(false);
      setNewUserEmail("");
      setNewUserPassword("");
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
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
        }}
      >
        <AuroraButton
          startIcon={<AuroraAddIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Add User
        </AuroraButton>
      </AuroraBox>

      <AuroraCard variant={embedded ? "outlined" : "elevation"}>
        <AuroraCardContent sx={{ p: 0 }}>
          <AuroraTableContainer>
            <AuroraTable>
              <AuroraTableHead>
                <AuroraTableRow>
                  <AuroraTableCell>Email</AuroraTableCell>
                  <AuroraTableCell>Role</AuroraTableCell>
                  <AuroraTableCell>Status</AuroraTableCell>
                  <AuroraTableCell align="right">Actions</AuroraTableCell>
                </AuroraTableRow>
              </AuroraTableHead>
              <AuroraTableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <AuroraTableRow key={index}>
                      <AuroraTableCell>
                        <AuroraSkeleton />
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraSkeleton />
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraSkeleton />
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraSkeleton />
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ))
                ) : users.length === 0 ? (
                  <AuroraTableRow>
                    <AuroraTableCell colSpan={4} align="center" sx={{ py: 8 }}>
                      <AuroraTypography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No users found
                      </AuroraTypography>
                      <AuroraButton
                        variant="contained"
                        startIcon={<AuroraAddIcon />}
                        onClick={() => setOpenAddModal(true)}
                      >
                        Add User
                      </AuroraButton>
                    </AuroraTableCell>
                  </AuroraTableRow>
                ) : (
                  users.map((user) => (
                    <AuroraTableRow key={user.id}>
                      <AuroraTableCell>
                        <AuroraTypography variant="body1">
                          {user.email}
                        </AuroraTypography>
                      </AuroraTableCell>
                      <AuroraTableCell>
                        <AuroraSelect
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          size="small"
                          sx={{ minWidth: 150 }}
                        >
                          <AuroraMenuItem value="admin">Admin</AuroraMenuItem>
                          <AuroraMenuItem value="hr">HR</AuroraMenuItem>
                          <AuroraMenuItem value="engineering_manager">
                            Engineering Manager
                          </AuroraMenuItem>
                          <AuroraMenuItem value="recruiter">
                            Recruiter
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
                      </AuroraTableCell>
                    </AuroraTableRow>
                  ))
                )}
              </AuroraTableBody>
            </AuroraTable>
          </AuroraTableContainer>
        </AuroraCardContent>
      </AuroraCard>

      <AuroraDialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <AuroraDialogTitle>Add New User</AuroraDialogTitle>
        <AuroraDialogContent>
          <AuroraInput
            fullWidth
            label="Email"
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            margin="normal"
          />
          <AuroraInput
            fullWidth
            label="Password"
            type="password"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            margin="normal"
          />
          <AuroraFormControl fullWidth margin="normal">
            <AuroraInputLabel>Role</AuroraInputLabel>
            <AuroraSelect
              value={newUserRole}
              label="Role"
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <AuroraMenuItem value="admin">Admin</AuroraMenuItem>
              <AuroraMenuItem value="hr">HR</AuroraMenuItem>
              <AuroraMenuItem value="engineering_manager">
                Engineering Manager
              </AuroraMenuItem>
              <AuroraMenuItem value="recruiter">Recruiter</AuroraMenuItem>
            </AuroraSelect>
          </AuroraFormControl>
        </AuroraDialogContent>
        <AuroraDialogActions>
          <AuroraButton onClick={() => setOpenAddModal(false)}>
            Cancel
          </AuroraButton>
          <AuroraButton onClick={handleAddUser} variant="contained">
            Create User
          </AuroraButton>
        </AuroraDialogActions>
      </AuroraDialog>
    </AuroraBox>
  );
}
