import { useState, useEffect } from "react";
import { departmentsService } from "@/services/departmentsService";
import { officesService } from "@/services/officesService";
import { usersService } from "@/services/usersService";
import { apiClient } from "@/services/clients";
import { useSnackbar } from "@/context/SnackbarContext";
import { AuroraBox, AuroraInput, AuroraButton, AuroraTypography, AuroraAvatar, AuroraGrid, AuroraSelect, AuroraMenuItem, AuroraFormControl, AuroraInputLabel, AuroraSaveIcon } from '@acentra/aurora-design-system';

export function ProfileSettings() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
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
      const updatedUser = await usersService.updateProfile(user.id, {
        name,
        department,
        office_location: officeLocation,
        profile_picture: profilePicture,
      });
      
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...updatedUser }));
      
      showSnackbar("Profile updated successfully", "success");
    } catch (err) {
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
        <AuroraAvatar
          src={profilePicture}
          sx={{ width: 80, height: 80, bgcolor: "primary.main" }}
        >
          {name?.[0] || user.email?.[0]}
        </AuroraAvatar>
        <AuroraInput
          label="Profile Picture URL"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          size="small"
          fullWidth
        />
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
        <AuroraGrid size={{ xs: 12 }}>
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
