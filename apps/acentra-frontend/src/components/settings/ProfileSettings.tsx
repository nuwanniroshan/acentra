import { useState, useEffect } from "react";
import { departmentsService } from "@/services/departmentsService";
import { officesService } from "@/services/officesService";
import { usersService } from "@/services/usersService";
import { useSnackbar } from "@/context/SnackbarContext";
import { API_BASE_URL } from "@/services/clients";
import {
  AuroraBox,
  AuroraInput,
  AuroraButton,
  AuroraTypography,
  AuroraAvatar,
  AuroraGrid,
  AuroraSelect,
  AuroraMenuItem,
  AuroraFormControl,
  AuroraInputLabel,
  AuroraSaveIcon,
  AuroraIconButton,
  AuroraCameraAltIcon,
} from "@acentra/aurora-design-system";

export function ProfileSettings() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const { showSnackbar } = useSnackbar();


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      // In a real app, we might want to fetch the latest user data from API
      // For now, let's assume we can get it or just use what we have, but better to fetch
      // Since we don't have a "me" endpoint, let's use the list and filter (not ideal but works for now)
      // Or better, let's just use the local storage and update it.
      // Actually, we should probably fetch the user list to find ourselves if we want fresh data
      // But for simplicity, let's rely on local storage for ID and then maybe fetch if needed.
      // Wait, we added updateProfile but not getProfile. Let's assume we can use the user object from login for now
      // and maybe we should have added a /me endpoint.
      // Let's just use the stored user and update it on save.

      setUser(userData);
      setName(userData.name || "");
      setDepartment(userData.department || "");
      setOfficeLocation(userData.office_location || "");
      setProfilePicture(userData.profile_picture || "");

      const deps = await departmentsService.getDepartments();
      setDepartments(deps);
      const offs = await officesService.getOffices();
      setOffices(offs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      // First upload profile picture if selected
      if (selectedFile) {
        const uploadedUser = await usersService.uploadProfilePicture(
          user.id,
          selectedFile,
        );

        // Append timestamp to force cache refresh
        const timestamp = new Date().getTime();
        const profilePictureWithVersion = uploadedUser.profile_picture
          ? `${uploadedUser.profile_picture}?v=${timestamp}`
          : "";

        // Update local storage with new profile picture
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        // We only update the local state representation, not the backend data 
        // (backend already has the correct path, we just add query param for client caching)
        const updatedUserLocal = {
          ...currentUser,
          profile_picture: profilePictureWithVersion,
        };

        localStorage.setItem("user", JSON.stringify(updatedUserLocal));
        setProfilePicture(profilePictureWithVersion);
        setSelectedFile(null);
        showSnackbar("Profile picture uploaded successfully", "success");

        // Dispatch custom event to notify other components of user update
        window.dispatchEvent(
          new CustomEvent("userUpdated", { detail: updatedUserLocal }),
        );
      }

      // Then update other profile data
      const updatedUser = await usersService.updateProfile(user.id, {
        name,
        department,
        office_location: officeLocation,
      });

      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const finalUser = { ...currentUser, ...updatedUser };

      // If we uploaded a file, preserve the versioned URL from currentUser
      // (which was updated in the previous block) so we don't lose the cache busting
      if (selectedFile && currentUser.profile_picture) {
        finalUser.profile_picture = currentUser.profile_picture;
      }

      localStorage.setItem("user", JSON.stringify(finalUser));

      showSnackbar("Profile updated successfully", "success");

      // Dispatch custom event to notify other components of user update
      window.dispatchEvent(
        new CustomEvent("userUpdated", { detail: finalUser }),
      );
    } catch {
      showSnackbar("Failed to update profile", "error");
    }
  };

  if (!user) return null;

  return (
    <AuroraBox sx={{ maxWidth: 600 }}>
      <AuroraTypography variant="h6" gutterBottom>
        Personal Information
      </AuroraTypography>

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
          <AuroraIconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            component="label"
          >
            <AuroraCameraAltIcon />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    showSnackbar("File size must not exceed 5MB", "error");
                    return;
                  }
                  setSelectedFile(file);
                }
              }}
            />
          </AuroraIconButton>
        </AuroraBox>
        <AuroraBox sx={{ flex: 1 }}>
          <AuroraTypography variant="body2" color="text.secondary">
            Click the camera icon to upload a new profile picture (max 5MB)
          </AuroraTypography>
          {selectedFile && (
            <AuroraTypography variant="body2" color="primary">
              Selected: {selectedFile.name}
            </AuroraTypography>
          )}
        </AuroraBox>
      </AuroraBox>

      <AuroraGrid container spacing={3}>
        <AuroraGrid size={{ xs: 12 }}>
          <AuroraInput
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </AuroraGrid>
        <AuroraGrid size={{ xs: 12, sm: 6 }}>
          <AuroraFormControl fullWidth>
            <AuroraInputLabel>Department</AuroraInputLabel>
            <AuroraSelect
              value={department}
              label="Department"
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dep) => (
                <AuroraMenuItem key={dep.id} value={dep.name}>
                  {dep.name}
                </AuroraMenuItem>
              ))}
            </AuroraSelect>
          </AuroraFormControl>
        </AuroraGrid>
        <AuroraGrid size={{ xs: 12, sm: 6 }}>
          <AuroraFormControl fullWidth>
            <AuroraInputLabel>Office Location</AuroraInputLabel>
            <AuroraSelect
              value={officeLocation}
              label="Office Location"
              onChange={(e) => setOfficeLocation(e.target.value)}
            >
              {offices.map((off) => (
                <AuroraMenuItem key={off.id} value={off.name}>
                  {off.name}
                </AuroraMenuItem>
              ))}
            </AuroraSelect>
          </AuroraFormControl>
        </AuroraGrid>
        <AuroraGrid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AuroraButton
            variant="contained"
            startIcon={<AuroraSaveIcon />}
            onClick={handleSave}
          >
            Save Changes
          </AuroraButton>
        </AuroraGrid>
      </AuroraGrid>
    </AuroraBox>
  );
}
