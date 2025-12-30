import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraInput,
  AuroraTypography,
  AuroraAvatar,
  AuroraGrid,
  AuroraButton
} from "@acentra/aurora-design-system";
import { API_BASE_URL } from "@/services/clients";
import { useSnackbar } from "@/context/SnackbarContext";
import { authService } from "@/services/authService";

export function ProfileSettings() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { showSnackbar } = useSnackbar();


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
      setName(userData.name || "");
      setDepartment(userData.department || "");
      setOfficeLocation(userData.office_location || "");
      setProfilePicture(userData.profile_picture || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      showSnackbar("New passwords do not match", "error");
      return;
    }
    if (!oldPassword || !newPassword) {
      showSnackbar("Please fill in all password fields", "error");
      return;
    }

    try {
      await authService.changePassword({ oldPassword, newPassword });
      showSnackbar("Password changed successfully", "success");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Failed to change password", "error");
    }
  };

  if (!user) return null;

  return (
    <AuroraBox sx={{ maxWidth: 600 }}>

      <AuroraBox sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <AuroraBox sx={{ position: "relative" }}>
          <AuroraAvatar
            src={
              profilePicture ? `${API_BASE_URL}/api/${profilePicture}` : undefined
            }
            sx={{ width: 80, height: 80, bgcolor: "primary.main" }}
          >
            {name?.[0] || user.email?.[0]}
          </AuroraAvatar>
        </AuroraBox>
        <AuroraBox sx={{ flex: 1 }}>
          <AuroraTypography variant="body2" color="text.secondary">
            Profile details are managed by your administrator.
          </AuroraTypography>
        </AuroraBox>
      </AuroraBox>

      <AuroraGrid container spacing={3}>
        <AuroraGrid size={{ xs: 12 }}>
          <AuroraInput
            fullWidth
            label="Full Name"
            value={name}
            disabled
          />
        </AuroraGrid>
        <AuroraGrid size={{ xs: 12, sm: 6 }}>
          <AuroraInput
            fullWidth
            label="Department"
            value={department}
            disabled
          />
        </AuroraGrid>
        <AuroraGrid size={{ xs: 12, sm: 6 }}>
          <AuroraInput
            fullWidth
            label="Office Location"
            value={officeLocation}
            disabled
          />
        </AuroraGrid>
      </AuroraGrid>

      <AuroraBox sx={{ mt: 6, pt: 4, borderTop: "1px solid", borderColor: "divider" }}>
        <AuroraTypography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Change Password
        </AuroraTypography>
        <AuroraGrid container spacing={3}>
          <AuroraGrid size={{ xs: 12 }}>
            <AuroraInput
              fullWidth
              type="password"
              label="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, sm: 6 }}>
            <AuroraInput
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12, sm: 6 }}>
            <AuroraInput
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </AuroraGrid>
          <AuroraGrid size={{ xs: 12 }}>
            <AuroraButton
              variant="contained"
              onClick={handlePasswordChange}
              disabled={!oldPassword || !newPassword || !confirmPassword}
            >
              Update Password
            </AuroraButton>
          </AuroraGrid>
        </AuroraGrid>
      </AuroraBox>
    </AuroraBox>
  );
}
