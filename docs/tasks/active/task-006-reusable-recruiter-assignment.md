# Task 006: Reusable Recruiter Assignment Component

**Priority:** MEDIUM  
**Estimated Effort:** 3-4 days  
**Status:** Not Started  
**Assignee:** TBD  
**Related PRD:** `.agent/prd-template-improvements.md` (Section 6)

---

## Objective

Create a generic, reusable user assignment component with autocomplete and chip-based selection that can be used across multiple features (jobs, candidates, feedback requests, etc.).

---

## Current Situation

**Existing Component:** `apps/acentra-frontend/src/components/UserAssignmentModal.tsx`

**Problems:**
- Tightly coupled to job assignment
- Hardcoded to recruiter role only
- Uses checkbox list (not scalable for large user lists)
- Cannot be reused for other features
- No autocomplete/search functionality
- No visual representation of selected users (chips)

---

## Requirements

### Must Have
- [ ] Generic component accepting any user role filter
- [ ] Autocomplete search with typeahead
- [ ] Selected users displayed as chips
- [ ] Support for single and multi-select modes
- [ ] Debounced search (300ms)
- [ ] User avatar/initials in results
- [ ] Configurable labels and titles

### Nice to Have
- [ ] Virtual scrolling for large user lists
- [ ] User metadata display (role, department)
- [ ] Recent selections
- [ ] Keyboard navigation
- [ ] Cached user data
- [ ] Max selections limit

---

## Component API Design

```typescript
interface UserAssignmentModalProps {
  // Display
  open: boolean;
  title?: string;
  searchPlaceholder?: string;
  
  // Mode
  mode?: 'single' | 'multiple';
  
  // Filtering
  roleFilter?: UserRole | UserRole[];
  excludeUserIds?: string[];
  
  // Data
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[]) => void;
  
  // Options
  maxSelections?: number;
  showUserRole?: boolean;
  showUserDepartment?: boolean;
  showUserAvatar?: boolean;
  
  // Callbacks
  onClose: () => void;
  onSave?: (userIds: string[]) => Promise<void>;
  
  // Advanced
  customFilter?: (user: User) => boolean;
  customRenderUser?: (user: User) => React.ReactNode;
}
```

---

## Implementation Plan

### Step 1: Create Component Structure

```
apps/acentra-frontend/src/components/UserAssignment/
├── index.ts                          (Barrel export)
├── UserAssignmentModal.tsx           (Main component)
├── UserAutocomplete.tsx              (Autocomplete input)
├── UserChip.tsx                      (Selected user chip)
├── UserListItem.tsx                  (Search result item)
├── UserAvatar.tsx                    (User avatar component)
├── useUserSearch.ts                  (Search hook)
└── types.ts                          (TypeScript types)
```

### Step 2: Implement User Search Hook

Create `useUserSearch.ts`:

```typescript
import { useState, useEffect, useMemo } from 'react';
import { usersService } from '@/services/usersService';
import { UserRole } from '@acentra/shared-types';
import { debounce } from 'lodash';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export const useUserSearch = (
  roleFilter?: UserRole | UserRole[],
  excludeIds: string[] = []
) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Load all users on mount
  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let fetchedUsers: User[];
      
      if (roleFilter) {
        const roles = Array.isArray(roleFilter) ? roleFilter : [roleFilter];
        fetchedUsers = await Promise.all(
          roles.map(role => usersService.getUsersByRole(role))
        ).then(results => results.flat());
      } else {
        fetchedUsers = await usersService.getAllUsers();
      }
      
      // Filter out excluded users
      const filtered = fetchedUsers.filter(u => !excludeIds.includes(u.id));
      
      setAllUsers(filtered);
      setUsers(filtered);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        if (!term) {
          setUsers(allUsers);
          return;
        }

        const lowerTerm = term.toLowerCase();
        const filtered = allUsers.filter(
          (user) =>
            user.email.toLowerCase().includes(lowerTerm) ||
            user.firstName?.toLowerCase().includes(lowerTerm) ||
            user.lastName?.toLowerCase().includes(lowerTerm)
        );
        setUsers(filtered);
      }, 300),
    [allUsers]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    refresh: loadUsers,
  };
};
```

### Step 3: Create User Avatar Component

Create `UserAvatar.tsx`:

```typescript
import { AuroraAvatar } from '@acentra/aurora-design-system';

interface UserAvatarProps {
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
  };
  size?: 'small' | 'medium' | 'large';
}

export const UserAvatar = ({ user, size = 'medium' }: UserAvatarProps) => {
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.email[0].toUpperCase();
  };

  const sizeMap = {
    small: 32,
    medium: 40,
    large: 48,
  };

  return (
    <AuroraAvatar
      src={user.avatar}
      alt={`${user.firstName} ${user.lastName}` || user.email}
      sx={{ width: sizeMap[size], height: sizeMap[size] }}
    >
      {getInitials()}
    </AuroraAvatar>
  );
};
```

### Step 4: Create User Chip Component

Create `UserChip.tsx`:

```typescript
import {
  AuroraChip,
  AuroraBox,
  AuroraTypography,
} from '@acentra/aurora-design-system';
import { UserAvatar } from './UserAvatar';

interface UserChipProps {
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    avatar?: string;
  };
  onRemove: (userId: string) => void;
  showAvatar?: boolean;
}

export const UserChip = ({ user, onRemove, showAvatar = true }: UserChipProps) => {
  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  return (
    <AuroraChip
      avatar={showAvatar ? <UserAvatar user={user} size="small" /> : undefined}
      label={displayName}
      onDelete={() => onRemove(user.id)}
      sx={{
        maxWidth: 200,
        '& .MuiChip-label': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      }}
    />
  );
};
```

### Step 5: Create User List Item Component

Create `UserListItem.tsx`:

```typescript
import {
  AuroraBox,
  AuroraTypography,
  AuroraListItem,
  AuroraListItemAvatar,
  AuroraListItemText,
} from '@acentra/aurora-design-system';
import { UserAvatar } from './UserAvatar';
import { UserRole } from '@acentra/shared-types';

interface UserListItemProps {
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: UserRole;
    department?: string;
    avatar?: string;
  };
  onClick: () => void;
  showRole?: boolean;
  showDepartment?: boolean;
}

export const UserListItem = ({
  user,
  onClick,
  showRole = false,
  showDepartment = false,
}: UserListItemProps) => {
  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  const secondaryText = [
    user.email,
    showRole && user.role,
    showDepartment && user.department,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <AuroraListItem
      button
      onClick={onClick}
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <AuroraListItemAvatar>
        <UserAvatar user={user} />
      </AuroraListItemAvatar>
      <AuroraListItemText
        primary={displayName}
        secondary={secondaryText}
        secondaryTypographyProps={{
          sx: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }}
      />
    </AuroraListItem>
  );
};
```

### Step 6: Create Main Modal Component

Create `UserAssignmentModal.tsx`:

```typescript
import { useState, useEffect } from 'react';
import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraButton,
  AuroraBox,
  AuroraTextField,
  AuroraList,
  AuroraTypography,
  AuroraCircularProgress,
  AuroraSearchIcon,
  AuroraInputAdornment,
} from '@acentra/aurora-design-system';
import { UserChip } from './UserChip';
import { UserListItem } from './UserListItem';
import { useUserSearch } from './useUserSearch';
import { UserRole } from '@acentra/shared-types';

export interface UserAssignmentModalProps {
  open: boolean;
  title?: string;
  searchPlaceholder?: string;
  mode?: 'single' | 'multiple';
  roleFilter?: UserRole | UserRole[];
  excludeUserIds?: string[];
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[]) => void;
  maxSelections?: number;
  showUserRole?: boolean;
  showUserDepartment?: boolean;
  showUserAvatar?: boolean;
  onClose: () => void;
  onSave?: (userIds: string[]) => Promise<void>;
}

export const UserAssignmentModal = ({
  open,
  title = 'Assign Users',
  searchPlaceholder = 'Search by name or email...',
  mode = 'multiple',
  roleFilter,
  excludeUserIds = [],
  selectedUserIds,
  onSelectionChange,
  maxSelections,
  showUserRole = false,
  showUserDepartment = false,
  showUserAvatar = true,
  onClose,
  onSave,
}: UserAssignmentModalProps) => {
  const { users, loading, searchTerm, setSearchTerm } = useUserSearch(
    roleFilter,
    excludeUserIds
  );

  const [localSelection, setLocalSelection] = useState<string[]>(selectedUserIds);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocalSelection(selectedUserIds);
  }, [selectedUserIds, open]);

  const selectedUsers = users.filter((u) => localSelection.includes(u.id));
  const availableUsers = users.filter((u) => !localSelection.includes(u.id));

  const handleUserClick = (userId: string) => {
    if (mode === 'single') {
      setLocalSelection([userId]);
    } else {
      if (maxSelections && localSelection.length >= maxSelections) {
        alert(`You can only select up to ${maxSelections} users`);
        return;
      }
      setLocalSelection([...localSelection, userId]);
    }
  };

  const handleUserRemove = (userId: string) => {
    setLocalSelection(localSelection.filter((id) => id !== userId));
  };

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      try {
        await onSave(localSelection);
        onSelectionChange(localSelection);
        onClose();
      } catch (error) {
        console.error('Failed to save assignments:', error);
        alert('Failed to save assignments');
      } finally {
        setSaving(false);
      }
    } else {
      onSelectionChange(localSelection);
      onClose();
    }
  };

  const handleClose = () => {
    setLocalSelection(selectedUserIds); // Reset to original
    onClose();
  };

  return (
    <AuroraDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <AuroraDialogTitle>{title}</AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraBox sx={{ mt: 1 }}>
          {/* Search Input */}
          <AuroraTextField
            fullWidth
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <AuroraInputAdornment position="start">
                  <AuroraSearchIcon />
                </AuroraInputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Selected Users */}
          {localSelection.length > 0 && (
            <AuroraBox sx={{ mb: 2 }}>
              <AuroraTypography variant="subtitle2" gutterBottom>
                Selected ({localSelection.length}
                {maxSelections && `/${maxSelections}`})
              </AuroraTypography>
              <AuroraBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedUsers.map((user) => (
                  <UserChip
                    key={user.id}
                    user={user}
                    onRemove={handleUserRemove}
                    showAvatar={showUserAvatar}
                  />
                ))}
              </AuroraBox>
            </AuroraBox>
          )}

          {/* Available Users */}
          <AuroraBox>
            <AuroraTypography variant="subtitle2" gutterBottom>
              {searchTerm ? 'Search Results' : 'Available Users'}
            </AuroraTypography>
            <AuroraBox
              sx={{
                maxHeight: 300,
                overflow: 'auto',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              {loading ? (
                <AuroraBox
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: 4,
                  }}
                >
                  <AuroraCircularProgress />
                </AuroraBox>
              ) : availableUsers.length === 0 ? (
                <AuroraBox sx={{ p: 4, textAlign: 'center' }}>
                  <AuroraTypography color="text.secondary">
                    {searchTerm
                      ? 'No users found matching your search'
                      : 'No users available'}
                  </AuroraTypography>
                </AuroraBox>
              ) : (
                <AuroraList>
                  {availableUsers.map((user) => (
                    <UserListItem
                      key={user.id}
                      user={user}
                      onClick={() => handleUserClick(user.id)}
                      showRole={showUserRole}
                      showDepartment={showUserDepartment}
                    />
                  ))}
                </AuroraList>
              )}
            </AuroraBox>
          </AuroraBox>
        </AuroraBox>
      </AuroraDialogContent>
      <AuroraDialogActions>
        <AuroraButton onClick={handleClose} disabled={saving}>
          Cancel
        </AuroraButton>
        <AuroraButton
          onClick={handleSave}
          variant="contained"
          disabled={saving || localSelection.length === 0}
        >
          {saving ? 'Saving...' : mode === 'single' ? 'Assign' : 'Assign Users'}
        </AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
};
```

### Step 7: Create Barrel Export

Create `index.ts`:

```typescript
export { UserAssignmentModal } from './UserAssignmentModal';
export type { UserAssignmentModalProps } from './UserAssignmentModal';
export { UserChip } from './UserChip';
export { UserListItem } from './UserListItem';
export { UserAvatar } from './UserAvatar';
export { useUserSearch } from './useUserSearch';
```

---

## Migration Plan

### Phase 1: Create New Component (Day 1-2)
- [ ] Implement all subcomponents
- [ ] Add TypeScript types
- [ ] Write unit tests
- [ ] Test in Storybook

### Phase 2: Migrate Job Assignment (Day 3)
- [ ] Update `Jobs.tsx` to use new component
- [ ] Update `JobDetails.tsx` to use new component
- [ ] Remove old `UserAssignmentModal.tsx`
- [ ] Test job assignment functionality

### Phase 3: Expand to Other Features (Day 4)
- [ ] Add to candidate assignment
- [ ] Add to feedback request assignment
- [ ] Document usage examples

---

## Usage Examples

### Example 1: Job Assignment (Multiple Recruiters)

```typescript
import { UserAssignmentModal } from '@/components/UserAssignment';
import { UserRole } from '@acentra/shared-types';

const [showAssignModal, setShowAssignModal] = useState(false);
const [assignedRecruiterIds, setAssignedRecruiterIds] = useState<string[]>([]);

<UserAssignmentModal
  open={showAssignModal}
  title="Assign Recruiters to Job"
  mode="multiple"
  roleFilter={UserRole.RECRUITER}
  selectedUserIds={assignedRecruiterIds}
  onSelectionChange={setAssignedRecruiterIds}
  onSave={async (ids) => {
    await jobsService.assignUsers(jobId, ids);
  }}
  onClose={() => setShowAssignModal(false)}
  showUserRole={false}
  showUserDepartment={true}
/>
```

### Example 2: Candidate Assignment (Single Recruiter)

```typescript
<UserAssignmentModal
  open={showAssignModal}
  title="Assign Primary Recruiter"
  mode="single"
  roleFilter={UserRole.RECRUITER}
  selectedUserIds={candidate.recruiterId ? [candidate.recruiterId] : []}
  onSelectionChange={(ids) => {
    updateCandidate({ recruiterId: ids[0] });
  }}
  onClose={() => setShowAssignModal(false)}
/>
```

### Example 3: Feedback Request (Multiple Roles)

```typescript
<UserAssignmentModal
  open={showAssignModal}
  title="Request Feedback From"
  mode="multiple"
  roleFilter={[UserRole.RECRUITER, UserRole.HIRING_MANAGER]}
  selectedUserIds={feedbackRequestUserIds}
  onSelectionChange={setFeedbackRequestUserIds}
  maxSelections={5}
  showUserRole={true}
  showUserDepartment={true}
  onClose={() => setShowAssignModal(false)}
/>
```

---

## Testing Checklist

### Unit Tests
- [ ] useUserSearch hook filters by role correctly
- [ ] useUserSearch hook debounces search
- [ ] useUserSearch hook excludes specified users
- [ ] UserChip renders correctly
- [ ] UserListItem renders correctly
- [ ] UserAvatar generates correct initials

### Integration Tests
- [ ] Modal opens and closes correctly
- [ ] Search filters users
- [ ] Single select mode works
- [ ] Multiple select mode works
- [ ] Max selections limit enforced
- [ ] Save callback is called with correct data
- [ ] Cancel resets selection

### E2E Tests
- [ ] Assign recruiters to job
- [ ] Assign recruiter to candidate
- [ ] Request feedback from multiple users

---

## Acceptance Criteria

- [ ] Component is fully generic and reusable
- [ ] Works with any user role filter
- [ ] Autocomplete search works smoothly
- [ ] Chip-based selection is intuitive
- [ ] Single and multi-select modes work
- [ ] Component is accessible (WCAG 2.1 AA)
- [ ] Performance is good (< 300ms search response)
- [ ] Successfully migrated job assignment
- [ ] Used in at least 3 different features

---

## Success Metrics

- **Target:** Component reused in 3+ features
- **Target:** 30% reduction in code duplication
- **Target:** 40% improvement in user assignment time
- **Target:** Zero regression bugs

---

## Notes

- Consider adding virtual scrolling for very large user lists (1000+)
- Future enhancement: Recent selections
- Future enhancement: User groups/teams
- Future enhancement: Bulk actions
