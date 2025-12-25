# Task 001: Email Template Placeholder Guide

**Priority:** HIGH  
**Estimated Effort:** 2-3 days  
**Status:** Not Started  
**Assignee:** TBD  
**Related PRD:** `.agent/prd-template-improvements.md` (Section 1)

---

## Objective

Add a comprehensive placeholder guide to the email template editor to help users discover and use available placeholders without trial and error.

---

## Requirements

### Must Have
- [ ] Expandable/collapsible placeholder reference panel
- [ ] Categorized placeholders (Candidate, Job, Company, System)
- [ ] Click-to-copy functionality for each placeholder
- [ ] Visual feedback when placeholder is copied
- [ ] Descriptions and example outputs for each placeholder

### Nice to Have
- [ ] Search/filter capability for placeholders
- [ ] Inline insertion at cursor position
- [ ] Visual indicators showing which placeholders are used in current template
- [ ] Keyboard shortcuts for common placeholders

---

## Technical Implementation

### Files to Create
```
apps/acentra-frontend/src/components/settings/
├── PlaceholderGuide.tsx          (New)
├── PlaceholderChip.tsx           (New)
└── placeholderDefinitions.ts     (New)
```

### Files to Modify
```
apps/acentra-frontend/src/components/settings/
└── EmailTemplateManager.tsx      (Update to include PlaceholderGuide)
```

### Placeholder Definitions

Create `placeholderDefinitions.ts`:
```typescript
export interface Placeholder {
  key: string;
  description: string;
  category: 'candidate' | 'job' | 'company' | 'system';
  example: string;
}

export const AVAILABLE_PLACEHOLDERS: Placeholder[] = [
  // Candidate Placeholders
  {
    key: '{{candidate_name}}',
    description: 'Full name of the candidate',
    category: 'candidate',
    example: 'John Doe'
  },
  {
    key: '{{candidate_email}}',
    description: 'Email address of the candidate',
    category: 'candidate',
    example: 'john.doe@example.com'
  },
  {
    key: '{{candidate_phone}}',
    description: 'Phone number of the candidate',
    category: 'candidate',
    example: '+1 (555) 123-4567'
  },
  
  // Job Placeholders
  {
    key: '{{job_title}}',
    description: 'Title of the job position',
    category: 'job',
    example: 'Senior Software Engineer'
  },
  {
    key: '{{job_department}}',
    description: 'Department for the job',
    category: 'job',
    example: 'Engineering'
  },
  {
    key: '{{job_location}}',
    description: 'Job location or office',
    category: 'job',
    example: 'San Francisco, CA'
  },
  {
    key: '{{job_type}}',
    description: 'Employment type',
    category: 'job',
    example: 'Full-time'
  },
  
  // Company Placeholders
  {
    key: '{{company_name}}',
    description: 'Name of the company',
    category: 'company',
    example: 'Acme Corporation'
  },
  {
    key: '{{recruiter_name}}',
    description: 'Name of the assigned recruiter',
    category: 'company',
    example: 'Jane Smith'
  },
  {
    key: '{{recruiter_email}}',
    description: 'Email of the assigned recruiter',
    category: 'company',
    example: 'jane.smith@acme.com'
  },
  
  // System Placeholders
  {
    key: '{{current_date}}',
    description: 'Current date',
    category: 'system',
    example: 'December 25, 2025'
  },
  {
    key: '{{application_link}}',
    description: 'Link to the job application',
    category: 'system',
    example: 'https://jobs.acme.com/apply/12345'
  },
];

export const PLACEHOLDER_CATEGORIES = {
  candidate: { label: 'Candidate', icon: '👤', color: '#3B82F6' },
  job: { label: 'Job', icon: '💼', color: '#10B981' },
  company: { label: 'Company', icon: '🏢', color: '#8B5CF6' },
  system: { label: 'System', icon: '⚙️', color: '#6B7280' },
};
```

### PlaceholderChip Component

Create `PlaceholderChip.tsx`:
```typescript
import { useState } from 'react';
import {
  AuroraChip,
  AuroraTooltip,
  AuroraBox,
  AuroraTypography,
} from '@acentra/aurora-design-system';
import { Placeholder } from './placeholderDefinitions';

interface PlaceholderChipProps {
  placeholder: Placeholder;
  onCopy?: (key: string) => void;
}

export const PlaceholderChip = ({ placeholder, onCopy }: PlaceholderChipProps) => {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(placeholder.key);
    setCopied(true);
    onCopy?.(placeholder.key);
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AuroraTooltip
      title={
        <AuroraBox>
          <AuroraTypography variant="body2" fontWeight="bold">
            {placeholder.description}
          </AuroraTypography>
          <AuroraTypography variant="caption" sx={{ mt: 0.5 }}>
            Example: {placeholder.example}
          </AuroraTypography>
        </AuroraBox>
      }
    >
      <AuroraChip
        label={copied ? '✓ Copied!' : placeholder.key}
        onClick={handleClick}
        size="small"
        variant="outlined"
        sx={{
          cursor: 'pointer',
          fontFamily: 'monospace',
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: 1,
          },
        }}
      />
    </AuroraTooltip>
  );
};
```

### PlaceholderGuide Component

Create `PlaceholderGuide.tsx`:
```typescript
import { useState } from 'react';
import {
  AuroraBox,
  AuroraTypography,
  AuroraAccordion,
  AuroraAccordionSummary,
  AuroraAccordionDetails,
  AuroraTextField,
  AuroraExpandMoreIcon,
} from '@acentra/aurora-design-system';
import { PlaceholderChip } from './PlaceholderChip';
import {
  AVAILABLE_PLACEHOLDERS,
  PLACEHOLDER_CATEGORIES,
  Placeholder,
} from './placeholderDefinitions';

export const PlaceholderGuide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(true);

  const filteredPlaceholders = AVAILABLE_PLACEHOLDERS.filter(
    (p) =>
      p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPlaceholders = filteredPlaceholders.reduce((acc, placeholder) => {
    if (!acc[placeholder.category]) {
      acc[placeholder.category] = [];
    }
    acc[placeholder.category].push(placeholder);
    return acc;
  }, {} as Record<string, Placeholder[]>);

  return (
    <AuroraAccordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{ mb: 2 }}
    >
      <AuroraAccordionSummary expandIcon={<AuroraExpandMoreIcon />}>
        <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AuroraTypography variant="subtitle1" fontWeight="bold">
            📋 Available Placeholders
          </AuroraTypography>
          <AuroraTypography variant="caption" color="text.secondary">
            ({AVAILABLE_PLACEHOLDERS.length} available)
          </AuroraTypography>
        </AuroraBox>
      </AuroraAccordionSummary>
      <AuroraAccordionDetails>
        <AuroraBox>
          <AuroraTypography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Click any placeholder to copy it to your clipboard, then paste it into your template.
          </AuroraTypography>

          <AuroraTextField
            fullWidth
            size="small"
            placeholder="Search placeholders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          {Object.entries(groupedPlaceholders).map(([category, placeholders]) => {
            const categoryInfo = PLACEHOLDER_CATEGORIES[category as keyof typeof PLACEHOLDER_CATEGORIES];
            return (
              <AuroraBox key={category} sx={{ mb: 2 }}>
                <AuroraTypography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <span>{categoryInfo.icon}</span>
                  {categoryInfo.label}
                </AuroraTypography>
                <AuroraBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {placeholders.map((placeholder) => (
                    <PlaceholderChip
                      key={placeholder.key}
                      placeholder={placeholder}
                    />
                  ))}
                </AuroraBox>
              </AuroraBox>
            );
          })}

          {filteredPlaceholders.length === 0 && (
            <AuroraTypography color="text.secondary" textAlign="center" sx={{ py: 2 }}>
              No placeholders found matching "{searchTerm}"
            </AuroraTypography>
          )}
        </AuroraBox>
      </AuroraAccordionDetails>
    </AuroraAccordion>
  );
};
```

### Update EmailTemplateManager

Modify `EmailTemplateManager.tsx` to include the PlaceholderGuide:
```typescript
// Add import
import { PlaceholderGuide } from './PlaceholderGuide';

// In the dialog content, add PlaceholderGuide before the body field:
<AuroraDialogContent>
  <AuroraBox sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
    {error && <AuroraAlert severity="error">{error}</AuroraAlert>}
    
    <AuroraTextField
      label="Template Name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      placeholder="e.g. Interview Invitation"
      fullWidth
    />
    
    <AuroraTextField
      label="Email Subject"
      value={formData.subject}
      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      placeholder="e.g. Interview Invitation - {{job_title}}"
      fullWidth
    />
    
    {/* ADD THIS */}
    <PlaceholderGuide />
    
    <AuroraTextField
      label="Message Body"
      value={formData.body}
      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
      multiline
      rows={10}
      placeholder="Hi {{candidate_name}}, ..."
      fullWidth
    />
  </AuroraBox>
</AuroraDialogContent>
```

---

## Testing Checklist

### Functional Testing
- [ ] Placeholder guide displays all placeholders correctly
- [ ] Placeholders are grouped by category
- [ ] Click-to-copy works for each placeholder
- [ ] Visual feedback shows when placeholder is copied
- [ ] Search/filter functionality works
- [ ] Tooltips display on hover with description and example
- [ ] Accordion expands/collapses correctly

### UI/UX Testing
- [ ] Guide doesn't obstruct template editing
- [ ] Responsive on different screen sizes
- [ ] Accessible via keyboard navigation
- [ ] Screen reader compatible
- [ ] Consistent with Aurora design system

### Integration Testing
- [ ] Copied placeholders work correctly in templates
- [ ] Templates with placeholders save correctly
- [ ] Placeholders render correctly in sent emails

---

## Acceptance Criteria

- [ ] All 12+ placeholders are documented and accessible
- [ ] Users can copy placeholders with a single click
- [ ] Guide is easily discoverable but not intrusive
- [ ] Search functionality helps users find placeholders quickly
- [ ] Component is fully accessible (WCAG 2.1 AA)
- [ ] No performance impact on template editor
- [ ] Documentation updated with placeholder list

---

## Success Metrics

- **Target:** 80% reduction in support tickets about placeholders
- **Target:** 100% of new templates use at least one placeholder
- **Target:** User satisfaction score > 4.5/5 for template creation

---

## Notes

- Consider adding a "recently used" section for frequently copied placeholders
- Future enhancement: Validate placeholders in template body and highlight invalid ones
- Future enhancement: Auto-suggest placeholders as user types in template body
