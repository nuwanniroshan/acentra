# Task 002: Rich Text Editor for Email Templates

**Priority:** MEDIUM  
**Estimated Effort:** 5-7 days  
**Status:** Not Started  
**Assignee:** TBD  
**Related PRD:** `.agent/prd-template-improvements.md` (Section 2)

---

## Objective

Replace the plain text email template editor with a rich text WYSIWYG editor that supports formatting while maintaining placeholder functionality.

---

## Requirements

### Must Have
- [ ] Rich text editor with formatting toolbar
- [ ] Support for bold, italic, underline, headings, lists, links
- [ ] Placeholder preservation in rich text mode
- [ ] HTML output generation for email sending
- [ ] Preview mode with sample data
- [ ] Email-client compatible HTML output

### Nice to Have
- [ ] Text color and background color
- [ ] Tables support
- [ ] Image insertion
- [ ] Mobile preview mode
- [ ] Template variables auto-complete
- [ ] Undo/redo with history

---

## Technical Implementation

### Library Selection

**Recommended: Lexical (Meta)**

**Pros:**
- Modern, actively maintained by Meta
- Excellent TypeScript support
- Extensible plugin architecture
- Great performance
- Built-in collaboration features (future use)

**Installation:**
```bash
cd apps/acentra-frontend
npm install lexical @lexical/react @lexical/html @lexical/list @lexical/link @lexical/rich-text @lexical/utils
```

**Alternative: Tiptap**
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder
```

---

### Files to Create

```
apps/acentra-frontend/src/components/editor/
├── RichTextEditor.tsx                    (Main editor component)
├── EditorToolbar.tsx                     (Formatting toolbar)
├── PlaceholderPlugin.tsx                 (Custom placeholder handling)
├── EmailPreview.tsx                      (Preview component)
├── editorConfig.ts                       (Editor configuration)
└── editorTheme.ts                        (Editor styling)
```

### Files to Modify

```
apps/acentra-frontend/src/components/settings/
└── EmailTemplateManager.tsx              (Replace TextField with RichTextEditor)

apps/acentra-backend/src/entity/
└── EmailTemplate.ts                      (Add htmlBody field)

apps/acentra-backend/src/controller/
└── EmailTemplateController.ts            (Handle HTML content)

apps/acentra-backend/src/service/
└── EmailService.ts                       (Send HTML emails)
```

---

## Implementation Details

### 1. Rich Text Editor Component (Lexical)

Create `RichTextEditor.tsx`:
```typescript
import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { AuroraBox } from '@acentra/aurora-design-system';

import { EditorToolbar } from './EditorToolbar';
import { PlaceholderPlugin } from './PlaceholderPlugin';
import { editorConfig } from './editorConfig';
import { editorTheme } from './editorTheme';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function OnChangePluginWrapper({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onChange(html);
        });
      }}
    />
  );
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const initialConfig = {
    namespace: 'EmailTemplateEditor',
    theme: editorTheme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: editorConfig.nodes,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <AuroraBox
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <EditorToolbar />
        <AuroraBox sx={{ position: 'relative', minHeight: 300 }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  minHeight: '300px',
                  padding: '16px',
                  outline: 'none',
                }}
              />
            }
            placeholder={
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  color: '#999',
                  pointerEvents: 'none',
                }}
              >
                {placeholder || 'Enter your email content...'}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePluginWrapper onChange={onChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <ListPlugin />
          <PlaceholderPlugin />
        </AuroraBox>
      </AuroraBox>
    </LexicalComposer>
  );
};
```

### 2. Editor Toolbar

Create `EditorToolbar.tsx`:
```typescript
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from 'lexical';
import {
  AuroraBox,
  AuroraIconButton,
  AuroraDivider,
  AuroraTooltip,
  AuroraBoldIcon,
  AuroraItalicIcon,
  AuroraUnderlinedIcon,
  AuroraFormatListBulletedIcon,
  AuroraFormatListNumberedIcon,
  AuroraLinkIcon,
} from '@acentra/aurora-design-system';

export const EditorToolbar = () => {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatList = (type: 'bullet' | 'number') => {
    // List formatting logic
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      // Link insertion logic
    }
  };

  return (
    <AuroraBox
      sx={{
        display: 'flex',
        gap: 0.5,
        p: 1,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        flexWrap: 'wrap',
      }}
    >
      <AuroraTooltip title="Bold">
        <AuroraIconButton size="small" onClick={() => formatText('bold')}>
          <AuroraBoldIcon />
        </AuroraIconButton>
      </AuroraTooltip>

      <AuroraTooltip title="Italic">
        <AuroraIconButton size="small" onClick={() => formatText('italic')}>
          <AuroraItalicIcon />
        </AuroraIconButton>
      </AuroraTooltip>

      <AuroraTooltip title="Underline">
        <AuroraIconButton size="small" onClick={() => formatText('underline')}>
          <AuroraUnderlinedIcon />
        </AuroraIconButton>
      </AuroraTooltip>

      <AuroraDivider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <AuroraTooltip title="Bulleted List">
        <AuroraIconButton size="small" onClick={() => formatList('bullet')}>
          <AuroraFormatListBulletedIcon />
        </AuroraIconButton>
      </AuroraTooltip>

      <AuroraTooltip title="Numbered List">
        <AuroraIconButton size="small" onClick={() => formatList('number')}>
          <AuroraFormatListNumberedIcon />
        </AuroraIconButton>
      </AuroraTooltip>

      <AuroraDivider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <AuroraTooltip title="Insert Link">
        <AuroraIconButton size="small" onClick={insertLink}>
          <AuroraLinkIcon />
        </AuroraIconButton>
      </AuroraTooltip>
    </AuroraBox>
  );
};
```

### 3. Placeholder Plugin

Create `PlaceholderPlugin.tsx`:
```typescript
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TextNode } from 'lexical';

// Custom node for placeholders
class PlaceholderNode extends TextNode {
  static getType() {
    return 'placeholder';
  }

  static clone(node: PlaceholderNode) {
    return new PlaceholderNode(node.__text, node.__key);
  }

  createDOM() {
    const element = document.createElement('span');
    element.style.backgroundColor = '#e3f2fd';
    element.style.padding = '2px 6px';
    element.style.borderRadius = '4px';
    element.style.fontFamily = 'monospace';
    element.style.fontSize = '0.9em';
    element.textContent = this.__text;
    return element;
  }

  updateDOM() {
    return false;
  }
}

export const PlaceholderPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register the custom placeholder node
    if (!editor.hasNodes([PlaceholderNode])) {
      throw new Error('PlaceholderPlugin: PlaceholderNode not registered');
    }

    // Listen for text changes and convert {{placeholder}} to PlaceholderNode
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // Logic to detect and convert placeholder patterns
      });
    });
  }, [editor]);

  return null;
};
```

### 4. Email Preview Component

Create `EmailPreview.tsx`:
```typescript
import { useState } from 'react';
import {
  AuroraDialog,
  AuroraDialogTitle,
  AuroraDialogContent,
  AuroraDialogActions,
  AuroraButton,
  AuroraBox,
  AuroraTypography,
  AuroraToggleButtonGroup,
  AuroraToggleButton,
} from '@acentra/aurora-design-system';

interface EmailPreviewProps {
  open: boolean;
  onClose: () => void;
  htmlContent: string;
  subject: string;
}

export const EmailPreview = ({ open, onClose, htmlContent, subject }: EmailPreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Sample data for preview
  const sampleData = {
    candidate_name: 'John Doe',
    candidate_email: 'john.doe@example.com',
    job_title: 'Senior Software Engineer',
    company_name: 'Acme Corporation',
    recruiter_name: 'Jane Smith',
  };

  // Replace placeholders with sample data
  const renderPreview = () => {
    let preview = htmlContent;
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return preview;
  };

  return (
    <AuroraDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <AuroraDialogTitle>
        Email Preview
        <AuroraBox sx={{ mt: 1 }}>
          <AuroraToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <AuroraToggleButton value="desktop">Desktop</AuroraToggleButton>
            <AuroraToggleButton value="mobile">Mobile</AuroraToggleButton>
          </AuroraToggleButtonGroup>
        </AuroraBox>
      </AuroraDialogTitle>
      <AuroraDialogContent>
        <AuroraBox
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            maxWidth: viewMode === 'mobile' ? 375 : '100%',
            mx: 'auto',
            backgroundColor: 'background.paper',
          }}
        >
          <AuroraTypography variant="h6" gutterBottom>
            Subject: {subject}
          </AuroraTypography>
          <AuroraBox
            dangerouslySetInnerHTML={{ __html: renderPreview() }}
            sx={{
              '& p': { mb: 1 },
              '& a': { color: 'primary.main' },
              '& ul, & ol': { pl: 3 },
            }}
          />
        </AuroraBox>
      </AuroraDialogContent>
      <AuroraDialogActions>
        <AuroraButton onClick={onClose}>Close</AuroraButton>
      </AuroraDialogActions>
    </AuroraDialog>
  );
};
```

### 5. Update EmailTemplateManager

Modify `EmailTemplateManager.tsx`:
```typescript
import { RichTextEditor } from '../editor/RichTextEditor';
import { EmailPreview } from '../editor/EmailPreview';

// Add state for preview
const [showPreview, setShowPreview] = useState(false);

// Replace the body TextField with RichTextEditor
<RichTextEditor
  value={formData.body}
  onChange={(html) => setFormData({ ...formData, body: html })}
  placeholder="Hi {{candidate_name}}, ..."
/>

// Add preview button in dialog actions
<AuroraDialogActions>
  <AuroraButton onClick={() => setShowPreview(true)} startIcon={<PreviewIcon />}>
    Preview
  </AuroraButton>
  <AuroraButton onClick={handleClose}>Cancel</AuroraButton>
  <AuroraButton onClick={handleSubmit} variant="contained">
    Save Template
  </AuroraButton>
</AuroraDialogActions>

// Add preview dialog
<EmailPreview
  open={showPreview}
  onClose={() => setShowPreview(false)}
  htmlContent={formData.body}
  subject={formData.subject}
/>
```

---

## Backend Changes

### 1. Update EmailTemplate Entity

```typescript
// apps/acentra-backend/src/entity/EmailTemplate.ts
@Entity()
export class EmailTemplate {
  // ... existing fields

  @Column({ type: 'text', nullable: true })
  body: string; // Keep for backward compatibility

  @Column({ type: 'text', nullable: true })
  htmlBody: string; // New field for HTML content

  @Column({ default: false })
  isHtml: boolean; // Flag to indicate HTML vs plain text
}
```

### 2. Create Migration

```bash
cd apps/acentra-backend
npm run migration:generate -- AddHtmlBodyToEmailTemplate
```

### 3. Update Email Sending Service

```typescript
// apps/acentra-backend/src/service/EmailService.ts
async sendEmail(template: EmailTemplate, data: Record<string, any>) {
  const content = template.isHtml ? template.htmlBody : template.body;
  let processedContent = content;

  // Replace placeholders
  Object.entries(data).forEach(([key, value]) => {
    processedContent = processedContent.replace(
      new RegExp(`{{${key}}}`, 'g'),
      String(value)
    );
  });

  await this.mailer.sendMail({
    to: data.candidate_email,
    subject: this.processPlaceholders(template.subject, data),
    [template.isHtml ? 'html' : 'text']: processedContent,
  });
}
```

---

## Migration Strategy

### Phase 1: Enable for New Templates
- Rich text editor available for new templates
- Existing templates remain plain text
- Set `isHtml: true` for new templates

### Phase 2: Opt-in Migration
- Add "Convert to Rich Text" button for existing templates
- Auto-convert plain text to HTML (preserve line breaks)
- User confirms conversion

### Phase 3: Full Rollout
- After 2 weeks of monitoring
- All templates support rich text
- Plain text mode still available via toggle

---

## Testing Checklist

### Functional Testing
- [ ] Rich text formatting works (bold, italic, underline, lists, links)
- [ ] Placeholders are preserved in rich text mode
- [ ] Placeholders are visually distinct
- [ ] HTML output is generated correctly
- [ ] Preview mode shows correct rendering
- [ ] Mobile preview works
- [ ] Undo/redo functionality works

### Email Client Testing
- [ ] Gmail (web, iOS, Android)
- [ ] Outlook (desktop, web)
- [ ] Apple Mail (macOS, iOS)
- [ ] Yahoo Mail
- [ ] ProtonMail

### Integration Testing
- [ ] Templates save with HTML content
- [ ] Emails send with correct HTML
- [ ] Placeholders are replaced in sent emails
- [ ] Backward compatibility with plain text templates

### Performance Testing
- [ ] Editor loads in <500ms
- [ ] No lag during typing
- [ ] Large templates (>5000 chars) perform well

---

## Acceptance Criteria

- [ ] Rich text editor fully functional with all formatting options
- [ ] Placeholders work seamlessly in rich text mode
- [ ] Preview mode accurately represents final email
- [ ] HTML output is email-client compatible (tested on 5+ clients)
- [ ] No breaking changes to existing plain text templates
- [ ] Performance meets requirements (<500ms load, no typing lag)
- [ ] Accessibility standards met (WCAG 2.1 AA)

---

## Success Metrics

- **Target:** 90% of new templates use rich text formatting
- **Target:** Zero email rendering issues reported
- **Target:** 30% increase in email open rates
- **Target:** User satisfaction score > 4.7/5

---

## Notes

- Consider using email-specific CSS inliner for better compatibility
- Add HTML sanitization to prevent XSS attacks
- Future enhancement: Template library with pre-designed layouts
- Future enhancement: Drag-and-drop email builder
