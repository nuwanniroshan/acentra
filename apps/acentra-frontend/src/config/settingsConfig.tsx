import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DomainIcon from '@mui/icons-material/Domain';
import TimelineIcon from '@mui/icons-material/Timeline';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import FeedbackIcon from '@mui/icons-material/Feedback';
import KeyIcon from '@mui/icons-material/Key';
import WebhookIcon from '@mui/icons-material/Webhook';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { PreferenceSettings } from '@/components/settings/PreferenceSettings';
import { OrganizationSettings } from '@/components/settings/OrganizationSettings';
import { PipelineSettings } from '@/components/settings/PipelineSettings';
import { EmailTemplateManager } from '@/components/settings/EmailTemplateManager';
import { FeedbackTemplatesPage } from '@/components/settings/FeedbackTemplatesPage';
import { ApiKeyManager } from '@/components/settings/ApiKeyManager';
import { ComingSoonPlaceholder } from '@/components/settings/ComingSoonPlaceholder';

export interface SettingsSection {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  component: React.ComponentType;
  roles?: string[]; // If undefined, visible to all
  badge?: string; // e.g., "New", "Beta"
  description?: string;
}

export interface SettingsCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  sections: SettingsSection[];
  roles?: string[]; // If undefined, visible to all
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
        icon: <AccountCircleIcon />,
        component: ProfileSettings,
        description: 'Manage your personal information and avatar',
      },
      {
        id: 'preferences',
        label: 'Preferences',
        path: '/settings/personal/preferences',
        icon: <TuneIcon />,
        component: PreferenceSettings,
        description: 'Customize your experience and preferences',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        path: '/settings/personal/notifications',
        icon: <NotificationsIcon />,
        component: ComingSoonPlaceholder,
        badge: 'Coming Soon',
        description: 'Configure your notification preferences',
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
        icon: <DomainIcon />,
        component: OrganizationSettings,
        roles: ['admin', 'hr'],
        description: 'Manage organization details and branding',
      },

      {
        id: 'pipeline',
        label: 'Pipeline',
        path: '/settings/workspace/pipeline',
        icon: <TimelineIcon />,
        component: PipelineSettings,
        roles: ['admin'],
        description: 'Configure recruitment pipeline stages',
      },
      {
        id: 'users',
        label: 'Users',
        path: '/settings/workspace/users',
        icon: <PeopleIcon />,
        component: ComingSoonPlaceholder,
        roles: ['admin'],
        badge: 'Coming Soon',
        description: 'Manage users and permissions',
      },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <DescriptionIcon />,
    roles: ['admin', 'hr'],
    sections: [
      {
        id: 'email',
        label: 'Email Templates',
        path: '/settings/templates/email',
        icon: <EmailIcon />,
        component: EmailTemplateManager,
        roles: ['admin', 'hr'],
        description: 'Manage email templates for communication',
      },
      {
        id: 'feedback',
        label: 'Feedback Templates',
        path: '/settings/templates/feedback',
        icon: <FeedbackIcon />,
        component: FeedbackTemplatesPage,
        roles: ['admin', 'hr'],
        description: 'Manage feedback and evaluation templates',
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
        icon: <KeyIcon />,
        component: ApiKeyManager,
        roles: ['admin'],
        description: 'Manage API keys and integrations',
      },
      {
        id: 'webhooks',
        label: 'Webhooks',
        path: '/settings/advanced/webhooks',
        icon: <WebhookIcon />,
        component: ComingSoonPlaceholder,
        roles: ['admin'],
        badge: 'Coming Soon',
        description: 'Configure webhook endpoints',
      },
    ],
  },
];

// Helper function to get all sections (flattened)
export const getAllSections = (): SettingsSection[] => {
  return settingsConfig.flatMap((category) => category.sections);
};

// Helper function to find section by path
export const findSectionByPath = (path: string): SettingsSection | undefined => {
  return getAllSections().find((section) => section.path === path);
};

// Helper function to get category for a section
export const getCategoryForSection = (sectionId: string): SettingsCategory | undefined => {
  return settingsConfig.find((category) =>
    category.sections.some((section) => section.id === sectionId)
  );
};
