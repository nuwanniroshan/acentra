import { useEffect, useState } from "react";
import { usersService } from "@/services/usersService";
import { jobsService } from "@/services/jobsService";
import { useSnackbar } from "@/context/SnackbarContext";
import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraButton,
  AuroraBox,
  AuroraCheckbox,
  AuroraFormControlLabel,
  AuroraTypography,
  AuroraList,
  AuroraListItem,
  AuroraInput,
} from "@acentra/aurora-design-system";

import { UserRole } from "@acentra/shared-types";

interface User {
  id: string;
  email: string;
  role: UserRole;
}

interface Props {
  jobId: string;
  currentAssignees: User[];
  onClose: () => void;
  onAssign: () => void;
}

export function UserAssignmentModal({
  jobId,
  currentAssignees,
  onClose,
  onAssign,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    loadUsers();
    setSelectedUserIds(currentAssignees.map((u) => u.id));
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersService.getUsersByRole(UserRole.RECRUITER);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSave = async () => {
    try {
      await jobsService.assignUsers(jobId, selectedUserIds);
      onAssign();
      onClose();
    } catch {
      showSnackbar("Failed to assign users", "error");
    }
  };

  return (
    <AuroraDialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <AuroraDialogTitle>Assign Recruiters</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraBox sx={{ mt: 1, mb: 2 }}>
          <AuroraInput
            label="Search recruiters"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            placeholder="Type to search by email..."
          />
        </AuroraBox>
        <AuroraBox sx={{ maxHeight: "300px", overflowY: "auto" }}>
          <AuroraList>
            {filteredUsers.map((user) => (
              <AuroraListItem key={user.id} sx={{ px: 0 }}>
                <AuroraFormControlLabel
                  control={
                    <AuroraCheckbox
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUser(user.id)}
                    />
                  }
                  label={
                    <AuroraBox>
                      <AuroraTypography variant="body1">
                        {user.email}
                      </AuroraTypography>
                    </AuroraBox>
                  }
                />
              </AuroraListItem>
            ))}
          </AuroraList>
        </AuroraBox>
      </AuroraDialogContent>
      <AuroraDialogActions>
        <AuroraButton onClick={onClose}>Cancel</AuroraButton>
        <AuroraButton onClick={handleSave} variant="contained">
          Save Assignments
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
}
