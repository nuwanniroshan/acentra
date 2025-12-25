# Task 009: Settings Menu Reorganization

**Story ID:** STORY-3.7  
**Priority:** 🟡 Medium  
**Story Points:** 13  
**Assignee:** TBD  
**Sprint:** TBD  
**Created:** December 25, 2025

---

## 📋 User Story

**As a** user of the Acentra ATS  
**I want** a well-organized, scalable settings interface  
**So that** I can easily find and manage settings as the application grows

---

## 🎯 Problem Statement

### Current Issues

The current settings page uses a **horizontal tab system** with the following problems:

1. **Scalability Issues:**
   - Currently 7 tabs (Profile, Preference, Organization, Pipeline, Email Templates, Feedback Templates, API Keys)
   - Horizontal tabs don't scale well beyond 5-7 items
   - Tab labels get cramped on smaller screens
   - No clear categorization or grouping

2. **Navigation Problems:**
   - All settings at the same level (no hierarchy)
   - Difficult to find specific settings
   - No search functionality
   - No visual grouping by category

3. **Role-Based Complexity:**
   - Conditional rendering makes tab indices confusing
   - Different users see different tabs
   - Hard to maintain as more roles are added

4. **Future Growth:**
   - More settings will be added (billing, integrations, notifications, security, etc.)
   - Current structure doesn't accommodate growth
   - Will become unwieldy with 10+ settings sections

---

## 🎨 UX Analysis & Recommendations

### Industry Best Practices

After analyzing leading SaaS applications (Notion, Linear, Slack, GitHub, Asana), here are the common patterns:

#### ✅ **Recommended: Sidebar Navigation with Categories**

**Examples:** GitHub Settings, Notion Settings, Linear Settings

**Advantages:**
- ✅ Scales to 20+ settings sections
- ✅ Clear visual hierarchy with categories
- ✅ Supports search and filtering
- ✅ Works well on all screen sizes
- ✅ Easy to add new sections
- ✅ Clear visual grouping
- ✅ Breadcrumb navigation

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Settings                                    [Search]│
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│ 👤 Personal  │  Profile Settings                    │
│   Profile    │  ┌────────────────────────────────┐ │
│   Preference │  │ Name: John Doe                 │ │
│              │  │ Email: john@example.com        │ │
│ 🏢 Workspace │  │ ...                            │ │
│   Organization│ └────────────────────────────────┘ │
│   Pipeline   │                                      │
│   Departments│                                      │
│   Branches   │                                      │
│              │                                      │
│ 📧 Templates │                                      │
│   Email      │                                      │
│   Feedback   │                                      │
│              │                                      │
│ 🔧 Advanced  │                                      │
│   API Keys   │                                      │
│   Webhooks   │                                      │
│   Security   │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

---

### Alternative Approaches (Not Recommended)

#### ❌ **Accordion/Expansion Panels**
- **Pros:** Compact, all on one page
- **Cons:** Requires scrolling, hard to navigate, poor for many sections
- **Verdict:** Not suitable for 10+ settings sections

#### ❌ **Card Grid Layout**
- **Pros:** Visual, works for dashboards
- **Cons:** Not suitable for settings, requires too many clicks
- **Verdict:** Better for feature discovery, not settings

#### ❌ **Vertical Tabs**
- **Pros:** Better than horizontal tabs
- **Cons:** Still no hierarchy, no categories, limited scalability
- **Verdict:** Marginal improvement over current approach

---

## 🎨 Proposed Design

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Acentra ATS                    [User Menu] [Notifications]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Settings                                          [🔍 Search]  │
│                                                                 │
│  ┌──────────────┬──────────────────────────────────────────┐   │
│  │              │                                          │   │
│  │ 👤 PERSONAL  │  Profile                                 │   │
│  │              │  ┌────────────────────────────────────┐  │   │
│  │ ○ Profile    │  │ Personal Information               │  │   │
│  │ ○ Preferences│  │                                    │  │   │
│  │ ○ Notifications│ │ Full Name                        │  │   │
│  │              │  │ [John Doe                    ]     │  │   │
│  │ 🏢 WORKSPACE │  │                                    │  │   │
│  │              │  │ Email Address                      │  │   │
│  │ ○ Organization│ │ [john@example.com           ]     │  │   │
│  │ ○ Departments│  │                                    │  │   │
│  │ ○ Branches   │  │ Phone Number                       │  │   │
│  │ ○ Pipeline   │  │ [+1 234 567 8900            ]     │  │   │
│  │ ○ Users      │  │                                    │  │   │
│  │              │  │ [Save Changes]                     │  │   │
│  │ 📧 TEMPLATES │  └────────────────────────────────────┘  │   │
│  │              │                                          │   │
│  │ ○ Email      │                                          │   │
│  │ ○ Feedback   │                                          │   │
│  │              │                                          │   │
│  │ 🔧 ADVANCED  │                                          │   │
│  │              │                                          │   │
│  │ ○ API Keys   │                                          │   │
│  │ ○ Webhooks   │                                          │   │
│  │ ○ Security   │                                          │   │
│  │ ○ Billing    │                                          │   │
│  │              │                                          │   │
│  └──────────────┴──────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Settings Categories & Structure

### Category 1: 👤 Personal
**Description:** User-specific settings

| Setting | Description | Current | Roles |
|---------|-------------|---------|-------|
| **Profile** | Personal information, avatar, bio | ✅ Exists | All |
| **Preferences** | UI preferences, language, timezone | ✅ Exists | All |
| **Notifications** | Email/push notification preferences | ❌ New | All |
| **Privacy** | Data privacy settings | ❌ Future | All |

---

### Category 2: 🏢 Workspace
**Description:** Organization-wide settings

| Setting | Description | Current | Roles |
|---------|-------------|---------|-------|
| **Organization** | Company info, branding | ✅ Exists | Admin, HR |
| **Departments** | Manage departments | ❌ New | Admin |
| **Branches** | Manage office locations | ❌ New | Admin |
| **Pipeline** | Recruitment pipeline stages | ✅ Exists | Admin |
| **Users** | User management, roles | ❌ New | Admin |
| **Teams** | Team structure | ❌ Future | Admin |

---

### Category 3: 📧 Templates
**Description:** Template management

| Setting | Description | Current | Roles |
|---------|-------------|---------|-------|
| **Email Templates** | Email template management | ✅ Exists | Admin, HR |
| **Feedback Templates** | Feedback form templates | ✅ Exists | Admin, HR |
| **Job Templates** | Job description templates | ❌ Future | Admin, HR |
| **Offer Templates** | Offer letter templates | ❌ Future | Admin, HR |

---

### Category 4: 🔧 Advanced
**Description:** Technical and advanced settings

| Setting | Description | Current | Roles |
|---------|-------------|---------|-------|
| **API Keys** | API key management | ✅ Exists | Admin |
| **Webhooks** | Webhook configuration | ❌ New | Admin |
| **Security** | Security settings, 2FA | ❌ New | Admin |
| **Billing** | Subscription and billing | ❌ Future | Admin |
| **Integrations** | Third-party integrations | ❌ Future | Admin |
| **Audit Log** | Activity audit log | ❌ Future | Admin |

---

## ✅ Acceptance Criteria

### Functional Requirements

- [ ] Sidebar navigation with 4 main categories (Personal, Workspace, Templates, Advanced)
- [ ] Each category has collapsible/expandable sections
- [ ] Active section highlighted in sidebar
- [ ] Search functionality to find settings
- [ ] Breadcrumb navigation (Settings > Workspace > Organization)
- [ ] Responsive design (mobile: drawer, desktop: sidebar)
- [ ] Role-based visibility (hide sections based on user role)
- [ ] Smooth transitions between sections
- [ ] URL routing for each setting section (e.g., `/settings/workspace/organization`)
- [ ] Keyboard navigation support (arrow keys, tab)

### UX Requirements

- [ ] Clear visual hierarchy with categories
- [ ] Icons for each category and section
- [ ] Loading states for each section
- [ ] Unsaved changes warning
- [ ] Success/error notifications
- [ ] Help text for complex settings
- [ ] Mobile-responsive (drawer on mobile)
- [ ] Accessible (ARIA labels, keyboard navigation)

### Performance Requirements

- [ ] Lazy load setting sections
- [ ] Section content loads only when selected
- [ ] Smooth animations (< 300ms)
- [ ] No layout shift when switching sections

---

## 🎨 Design Specifications

### Sidebar

**Width:**
- Desktop: 240px
- Tablet: 200px
- Mobile: Drawer (full width)

**Category Styling:**
```css
Category Header:
- Font: 12px, uppercase, bold
- Color: text.secondary
- Margin: 24px 0 8px 0
- Letter-spacing: 0.5px

Category Item:
- Font: 14px, regular
- Padding: 8px 16px
- Border-radius: 6px
- Hover: background.hover
- Active: background.selected + primary color

Icons:
- Size: 20px
- Color: text.secondary
- Active: primary color
```

### Content Area

**Layout:**
```css
Container:
- Max-width: 800px
- Padding: 32px
- Background: background.paper

Section Header:
- Font: 24px, bold
- Margin-bottom: 8px

Section Description:
- Font: 14px, regular
- Color: text.secondary
- Margin-bottom: 24px

Form Fields:
- Max-width: 500px
- Spacing: 16px between fields
```

---

## 📝 Implementation Tasks

### Phase 1: Core Structure (5 points)

#### 1.1 Create Sidebar Navigation Component (2 pts)
```typescript
// components/settings/SettingsSidebar.tsx
interface SettingsCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  sections: SettingsSection[];
  roles?: string[]; // Visible to these roles
}

interface SettingsSection {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  roles?: string[];
}
```

**Tasks:**
- [ ] Create SettingsSidebar component
- [ ] Implement category rendering
- [ ] Add expand/collapse functionality
- [ ] Add active state highlighting
- [ ] Implement role-based filtering

---

#### 1.2 Create Settings Layout Component (1 pt)
```typescript
// components/settings/SettingsLayout.tsx
interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}
```

**Tasks:**
- [ ] Create SettingsLayout wrapper
- [ ] Add breadcrumb navigation
- [ ] Add responsive sidebar (drawer on mobile)
- [ ] Add header with search

---

#### 1.3 Update Settings Page (1 pt)
```typescript
// pages/Settings.tsx
// Refactor to use new sidebar layout
```

**Tasks:**
- [ ] Replace tab system with sidebar
- [ ] Implement URL routing for sections
- [ ] Add search functionality
- [ ] Add mobile drawer

---

#### 1.4 Create Settings Configuration (1 pt)
```typescript
// config/settingsConfig.ts
export const settingsConfig: SettingsCategory[] = [
  {
    id: 'personal',
    label: 'Personal',
    icon: <PersonIcon />,
    sections: [
      { id: 'profile', label: 'Profile', path: '/settings/personal/profile' },
      { id: 'preferences', label: 'Preferences', path: '/settings/personal/preferences' },
      { id: 'notifications', label: 'Notifications', path: '/settings/personal/notifications' },
    ],
  },
  // ... more categories
];
```

**Tasks:**
- [ ] Create settings configuration file
- [ ] Define all categories and sections
- [ ] Add role-based permissions
- [ ] Add icons for each section

---

### Phase 2: Search & Navigation (3 points)

#### 2.1 Implement Search Functionality (2 pts)
```typescript
// components/settings/SettingsSearch.tsx
// Search across all settings sections
```

**Tasks:**
- [ ] Create search input component
- [ ] Implement fuzzy search
- [ ] Show search results with highlights
- [ ] Navigate to section on result click
- [ ] Add keyboard shortcuts (Cmd+K)

---

#### 2.2 Add Breadcrumb Navigation (1 pt)
```typescript
// components/settings/SettingsBreadcrumbs.tsx
// Settings > Workspace > Organization
```

**Tasks:**
- [ ] Create breadcrumb component
- [ ] Update on section change
- [ ] Make breadcrumbs clickable
- [ ] Add to all setting sections

---

### Phase 3: New Settings Sections (3 points)

#### 3.1 Create Notifications Settings (1 pt)
```typescript
// components/settings/NotificationSettings.tsx
// Email notifications, push notifications, etc.
```

**Tasks:**
- [ ] Create NotificationSettings component
- [ ] Add email notification toggles
- [ ] Add notification frequency settings
- [ ] Save to backend

---

#### 3.2 Create Departments Settings (1 pt)
```typescript
// components/settings/DepartmentSettings.tsx
// Manage departments
```

**Tasks:**
- [ ] Create DepartmentSettings component
- [ ] List all departments
- [ ] Add/edit/delete departments
- [ ] Integrate with backend

---

#### 3.3 Create Branches Settings (1 pt)
```typescript
// components/settings/BranchSettings.tsx
// Manage office locations
```

**Tasks:**
- [ ] Create BranchSettings component
- [ ] List all branches
- [ ] Add/edit/delete branches
- [ ] Integrate with backend

---

### Phase 4: Polish & Optimization (2 points)

#### 4.1 Add Animations & Transitions (0.5 pts)
**Tasks:**
- [ ] Add smooth sidebar transitions
- [ ] Add content fade-in animations
- [ ] Add loading skeletons
- [ ] Optimize animation performance

---

#### 4.2 Mobile Responsiveness (0.5 pts)
**Tasks:**
- [ ] Implement mobile drawer
- [ ] Add hamburger menu
- [ ] Test on mobile devices
- [ ] Fix mobile layout issues

---

#### 4.3 Accessibility (0.5 pts)
**Tasks:**
- [ ] Add ARIA labels
- [ ] Implement keyboard navigation
- [ ] Test with screen readers
- [ ] Fix accessibility issues

---

#### 4.4 Testing & Documentation (0.5 pts)
**Tasks:**
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update user documentation
- [ ] Create settings guide

---

## 🎨 Visual Design Mockups

### Desktop View
```
┌─────────────────────────────────────────────────────────────────┐
│ Acentra ATS                                    [User] [🔔]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Settings                                    [🔍 Search settings]│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                 │
│  ┌─────────────────┬───────────────────────────────────────┐   │
│  │                 │                                       │   │
│  │ 👤 PERSONAL     │  Settings > Personal > Profile       │   │
│  │                 │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│  │ ● Profile       │                                       │   │
│  │ ○ Preferences   │  Profile                              │   │
│  │ ○ Notifications │  Update your personal information     │   │
│  │                 │                                       │   │
│  │ 🏢 WORKSPACE    │  ┌─────────────────────────────────┐  │   │
│  │                 │  │                                 │  │   │
│  │ ○ Organization  │  │ Full Name                       │  │   │
│  │ ○ Departments   │  │ [John Doe                  ]    │  │   │
│  │ ○ Branches      │  │                                 │  │   │
│  │ ○ Pipeline      │  │ Email Address                   │  │   │
│  │ ○ Users         │  │ [john@example.com          ]    │  │   │
│  │                 │  │                                 │  │   │
│  │ 📧 TEMPLATES    │  │ Phone Number                    │  │   │
│  │                 │  │ [+1 234 567 8900           ]    │  │   │
│  │ ○ Email         │  │                                 │  │   │
│  │ ○ Feedback      │  │ Bio                             │  │   │
│  │                 │  │ [                          ]    │  │   │
│  │ 🔧 ADVANCED     │  │ [                          ]    │  │   │
│  │                 │  │                                 │  │   │
│  │ ○ API Keys      │  │ [Cancel]  [Save Changes]        │  │   │
│  │ ○ Webhooks      │  │                                 │  │   │
│  │ ○ Security      │  └─────────────────────────────────┘  │   │
│  │                 │                                       │   │
│  └─────────────────┴───────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌─────────────────────────────┐
│ ☰  Settings         [🔍]   │
├─────────────────────────────┤
│                             │
│  Settings > Profile         │
│  ━━━━━━━━━━━━━━━━━━━━━━━  │
│                             │
│  Profile                    │
│  Update your personal info  │
│                             │
│  ┌───────────────────────┐  │
│  │ Full Name            │  │
│  │ [John Doe       ]    │  │
│  │                      │  │
│  │ Email Address        │  │
│  │ [john@example.com]   │  │
│  │                      │  │
│  │ Phone Number         │  │
│  │ [+1 234 567 8900]    │  │
│  │                      │  │
│  │ [Save Changes]       │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘

Drawer (when ☰ clicked):
┌─────────────────────────────┐
│ Settings            [✕]     │
├─────────────────────────────┤
│                             │
│ 👤 PERSONAL                 │
│ ● Profile                   │
│ ○ Preferences               │
│ ○ Notifications             │
│                             │
│ 🏢 WORKSPACE                │
│ ○ Organization              │
│ ○ Departments               │
│ ○ Branches                  │
│ ○ Pipeline                  │
│                             │
│ 📧 TEMPLATES                │
│ ○ Email                     │
│ ○ Feedback                  │
│                             │
│ 🔧 ADVANCED                 │
│ ○ API Keys                  │
│ ○ Webhooks                  │
│ ○ Security                  │
│                             │
└─────────────────────────────┘
```

---

## 🔧 Technical Implementation

### File Structure
```
apps/acentra-frontend/src/
├── components/
│   └── settings/
│       ├── SettingsLayout.tsx          # Main layout wrapper
│       ├── SettingsSidebar.tsx         # Sidebar navigation
│       ├── SettingsSearch.tsx          # Search component
│       ├── SettingsBreadcrumbs.tsx     # Breadcrumb navigation
│       ├── SettingsSection.tsx         # Section wrapper
│       │
│       ├── personal/
│       │   ├── ProfileSettings.tsx     # Existing
│       │   ├── PreferenceSettings.tsx  # Existing
│       │   └── NotificationSettings.tsx # New
│       │
│       ├── workspace/
│       │   ├── OrganizationSettings.tsx # Existing
│       │   ├── DepartmentSettings.tsx   # New
│       │   ├── BranchSettings.tsx       # New
│       │   ├── PipelineSettings.tsx     # Existing
│       │   └── UserSettings.tsx         # New
│       │
│       ├── templates/
│       │   ├── EmailTemplateManager.tsx    # Existing
│       │   └── FeedbackTemplatesPage.tsx   # Existing
│       │
│       └── advanced/
│           ├── ApiKeyManager.tsx        # Existing
│           ├── WebhookSettings.tsx      # New
│           └── SecuritySettings.tsx     # New
│
├── config/
│   └── settingsConfig.ts               # Settings configuration
│
└── pages/
    └── Settings.tsx                    # Main settings page
```

---

### Settings Configuration

```typescript
// config/settingsConfig.ts
import {
  PersonIcon,
  BusinessIcon,
  EmailIcon,
  SettingsIcon,
} from '@acentra/aurora-design-system';

export interface SettingsSection {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  component: React.ComponentType;
  roles?: string[]; // If undefined, visible to all
  badge?: string; // e.g., "New", "Beta"
}

export interface SettingsCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  sections: SettingsSection[];
  roles?: string[];
}

export const settingsConfig: SettingsCategory[] = [
  {
    id: 'personal',
    label: 'Personal',
    icon: <PersonIcon />,
    sections: [
      {
        id: 'profile',
        label: 'Profile',
        path: '/settings/personal/profile',
        component: ProfileSettings,
      },
      {
        id: 'preferences',
        label: 'Preferences',
        path: '/settings/personal/preferences',
        component: PreferenceSettings,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        path: '/settings/personal/notifications',
        component: NotificationSettings,
        badge: 'New',
      },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    icon: <BusinessIcon />,
    roles: ['admin', 'hr'],
    sections: [
      {
        id: 'organization',
        label: 'Organization',
        path: '/settings/workspace/organization',
        component: OrganizationSettings,
        roles: ['admin', 'hr'],
      },
      {
        id: 'departments',
        label: 'Departments',
        path: '/settings/workspace/departments',
        component: DepartmentSettings,
        roles: ['admin'],
        badge: 'New',
      },
      {
        id: 'branches',
        label: 'Branches',
        path: '/settings/workspace/branches',
        component: BranchSettings,
        roles: ['admin'],
        badge: 'New',
      },
      {
        id: 'pipeline',
        label: 'Pipeline',
        path: '/settings/workspace/pipeline',
        component: PipelineSettings,
        roles: ['admin'],
      },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <EmailIcon />,
    roles: ['admin', 'hr'],
    sections: [
      {
        id: 'email',
        label: 'Email Templates',
        path: '/settings/templates/email',
        component: EmailTemplateManager,
      },
      {
        id: 'feedback',
        label: 'Feedback Templates',
        path: '/settings/templates/feedback',
        component: FeedbackTemplatesPage,
      },
    ],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: <SettingsIcon />,
    roles: ['admin'],
    sections: [
      {
        id: 'api-keys',
        label: 'API Keys',
        path: '/settings/advanced/api-keys',
        component: ApiKeyManager,
      },
      {
        id: 'webhooks',
        label: 'Webhooks',
        path: '/settings/advanced/webhooks',
        component: WebhookSettings,
        badge: 'New',
      },
      {
        id: 'security',
        label: 'Security',
        path: '/settings/advanced/security',
        component: SecuritySettings,
        badge: 'New',
      },
    ],
  },
];
```

---

### Sidebar Component

```typescript
// components/settings/SettingsSidebar.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AuroraBox,
  AuroraList,
  AuroraListItem,
  AuroraListItemButton,
  AuroraListItemIcon,
  AuroraListItemText,
  AuroraCollapse,
  AuroraChip,
  AuroraTypography,
} from '@acentra/aurora-design-system';
import { settingsConfig } from '@/config/settingsConfig';
import { useAuth } from '@/hooks/useAuth';

export function SettingsSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['personal']);

  const hasAccess = (roles?: string[]) => {
    if (!roles) return true;
    return roles.includes(user.role);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AuroraBox
      sx={{
        width: 240,
        borderRight: 1,
        borderColor: 'divider',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <AuroraList>
        {settingsConfig
          .filter((category) => hasAccess(category.roles))
          .map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <AuroraListItemButton
                onClick={() => toggleCategory(category.id)}
                sx={{ py: 1.5 }}
              >
                <AuroraListItemIcon>{category.icon}</AuroraListItemIcon>
                <AuroraListItemText
                  primary={
                    <AuroraTypography
                      variant="caption"
                      sx={{
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: 0.5,
                      }}
                    >
                      {category.label}
                    </AuroraTypography>
                  }
                />
              </AuroraListItemButton>

              {/* Category Sections */}
              <AuroraCollapse in={expandedCategories.includes(category.id)}>
                <AuroraList component="div" disablePadding>
                  {category.sections
                    .filter((section) => hasAccess(section.roles))
                    .map((section) => (
                      <AuroraListItemButton
                        key={section.id}
                        selected={isActive(section.path)}
                        onClick={() => navigate(section.path)}
                        sx={{ pl: 4, py: 1 }}
                      >
                        <AuroraListItemText primary={section.label} />
                        {section.badge && (
                          <AuroraChip
                            label={section.badge}
                            size="small"
                            color="primary"
                            sx={{ height: 20, fontSize: 10 }}
                          />
                        )}
                      </AuroraListItemButton>
                    ))}
                </AuroraList>
              </AuroraCollapse>
            </div>
          ))}
      </AuroraList>
    </AuroraBox>
  );
}
```

---

## 📊 Success Metrics

### User Experience
- [ ] Time to find a setting reduced by 50%
- [ ] User satisfaction score > 4.5/5
- [ ] Zero complaints about settings navigation
- [ ] Mobile usage > 30% (currently low)

### Technical
- [ ] Page load time < 1 second
- [ ] Section switch time < 300ms
- [ ] Search results < 100ms
- [ ] Zero accessibility issues

### Business
- [ ] Support tickets about settings reduced by 60%
- [ ] Settings usage increased by 40%
- [ ] New settings can be added in < 30 minutes

---

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users confused by new layout | Medium | Add onboarding tour, keep old layout for 1 week |
| Mobile navigation issues | Medium | Extensive mobile testing, user feedback |
| Performance degradation | Low | Lazy loading, code splitting |
| Breaking existing settings | High | Comprehensive testing, gradual rollout |

---

## 📚 Resources

### Design Inspiration
- [GitHub Settings](https://github.com/settings/profile)
- [Linear Settings](https://linear.app/settings)
- [Notion Settings](https://www.notion.so/my-settings)
- [Slack Settings](https://slack.com/account/settings)

### Technical References
- [React Router v6 Nested Routes](https://reactrouter.com/docs/en/v6/getting-started/overview)
- [MUI Drawer Component](https://mui.com/material-ui/react-drawer/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## ✅ Definition of Done

- [ ] All 4 categories implemented
- [ ] All existing settings migrated
- [ ] 3 new settings sections added (Notifications, Departments, Branches)
- [ ] Search functionality working
- [ ] Breadcrumb navigation working
- [ ] Mobile responsive (drawer)
- [ ] Keyboard navigation working
- [ ] All tests passing (>80% coverage)
- [ ] Documentation updated
- [ ] User guide created
- [ ] Deployed to staging
- [ ] QA approved
- [ ] User testing completed
- [ ] Deployed to production

---

**Created:** December 25, 2025  
**Last Updated:** December 25, 2025  
**Status:** 📝 Ready for Development  
**Estimated Effort:** 13 story points (1-2 weeks)
