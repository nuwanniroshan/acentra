import { useState, useEffect } from "react";
import {
  AuroraBox,
  AuroraInput,
  AuroraTypography,
  AuroraAvatar,
  AuroraGrid,
} from "@acentra/aurora-design-system";
import { API_BASE_URL } from "@/services/clients";

export function ProfileSettings() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [officeLocation, setOfficeLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

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
    </AuroraBox>
  );
}
