# Task 005: Aurora Logo Integration

**Priority:** LOW  
**Estimated Effort:** 1 day  
**Status:** Not Started  
**Assignee:** TBD  
**Related PRD:** `.agent/prd-template-improvements.md` (Section 5)

---

## Objective

Replace the current logo with the Aurora logo across all interfaces to establish consistent branding throughout the application.

---

## Requirements

### Must Have
- [ ] Aurora logo in main navigation header
- [ ] Aurora logo on login page
- [ ] Aurora logo on public job posting pages
- [ ] Updated favicon
- [ ] Light and dark theme variants
- [ ] Responsive sizing (full logo on desktop, icon on mobile)

### Nice to Have
- [ ] Animated logo on loading states
- [ ] Logo in email templates
- [ ] Logo in PDF exports (if applicable)

---

## Logo Asset Requirements

### File Formats Needed

1. **SVG (Primary)**
   - `aurora-logo-light.svg` - For light backgrounds
   - `aurora-logo-dark.svg` - For dark backgrounds
   - `aurora-icon-light.svg` - Icon-only version for mobile
   - `aurora-icon-dark.svg` - Icon-only version for mobile

2. **PNG (Fallback)**
   - `aurora-logo-light.png` (2x, 3x for retina)
   - `aurora-logo-dark.png` (2x, 3x for retina)
   - `aurora-icon-light.png` (2x, 3x for retina)
   - `aurora-icon-dark.png` (2x, 3x for retina)

3. **Favicon**
   - `favicon.ico` (16x16, 32x32, 48x48)
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png` (180x180)
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`

### Specifications

- **Full Logo Dimensions:** 200px width (height auto-scaled)
- **Icon Dimensions:** 48px × 48px
- **File Size:** < 50KB per file
- **Color Space:** RGB
- **Transparency:** Required for PNG/SVG

---

## Implementation Plan

### Step 1: Prepare Assets

Create asset directory structure:
```
apps/acentra-frontend/public/
├── logo/
│   ├── aurora-logo-light.svg
│   ├── aurora-logo-dark.svg
│   ├── aurora-icon-light.svg
│   ├── aurora-icon-dark.svg
│   ├── aurora-logo-light.png
│   ├── aurora-logo-dark.png
│   ├── aurora-icon-light.png
│   └── aurora-icon-dark.png
└── favicon/
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    └── android-chrome-512x512.png
```

### Step 2: Create Logo Component

Create `apps/acentra-frontend/src/components/common/AuroraLogo.tsx`:

```typescript
import { useTheme } from '@/context/ThemeContext';
import { AuroraBox } from '@acentra/aurora-design-system';

interface AuroraLogoProps {
  variant?: 'full' | 'icon';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const sizeMap = {
  small: { full: 120, icon: 32 },
  medium: { full: 160, icon: 40 },
  large: { full: 200, icon: 48 },
};

export const AuroraLogo = ({
  variant = 'full',
  size = 'medium',
  onClick,
}: AuroraLogoProps) => {
  const { theme } = useTheme();
  
  // Determine which logo to use based on theme
  const logoSuffix = theme === 'dark' ? 'dark' : 'light';
  const logoType = variant === 'icon' ? 'icon' : 'logo';
  const logoPath = `/logo/aurora-${logoType}-${logoSuffix}.svg`;
  
  const dimensions = sizeMap[size][variant];

  return (
    <AuroraBox
      component="img"
      src={logoPath}
      alt="Aurora ATS"
      onClick={onClick}
      sx={{
        height: variant === 'full' ? 'auto' : dimensions,
        width: variant === 'full' ? dimensions : 'auto',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'opacity 0.2s',
        '&:hover': onClick ? { opacity: 0.8 } : {},
      }}
    />
  );
};
```

### Step 3: Update Navigation Header

**File:** `apps/acentra-frontend/src/components/Layout.tsx`

```typescript
import { AuroraLogo } from './common/AuroraLogo';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';

// Inside the component
const navigate = useNavigate();
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

// Replace existing logo with:
<AuroraLogo
  variant={isMobile ? 'icon' : 'full'}
  size="medium"
  onClick={() => navigate('/')}
/>
```

### Step 4: Update Login Page

**File:** `apps/acentra-frontend/src/pages/Login.tsx`

```typescript
import { AuroraLogo } from '@/components/common/AuroraLogo';

// In the login form, replace existing logo:
<AuroraBox sx={{ textAlign: 'center', mb: 4 }}>
  <AuroraLogo variant="full" size="large" />
  <AuroraTypography variant="h5" sx={{ mt: 2 }}>
    Welcome to Aurora ATS
  </AuroraTypography>
</AuroraBox>
```

### Step 5: Update Public Layout

**File:** `apps/acentra-frontend/src/layouts/PublicLayout.tsx`

```typescript
import { AuroraLogo } from '@/components/common/AuroraLogo';

// In the header:
<AuroraBox sx={{ py: 2, px: 3, borderBottom: 1, borderColor: 'divider' }}>
  <AuroraLogo variant="full" size="medium" />
</AuroraBox>
```

### Step 6: Update Favicon

**File:** `apps/acentra-frontend/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />
    
    <!-- Web App Manifest -->
    <link rel="manifest" href="/site.webmanifest" />
    
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aurora ATS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Step 7: Create Web App Manifest

Create `apps/acentra-frontend/public/site.webmanifest`:

```json
{
  "name": "Aurora ATS",
  "short_name": "Aurora",
  "description": "Aurora Applicant Tracking System",
  "icons": [
    {
      "src": "/favicon/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/favicon/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#1976d2",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/"
}
```

---

## Logo Usage Guidelines

Create `apps/acentra-frontend/src/components/common/LOGO_GUIDELINES.md`:

```markdown
# Aurora Logo Usage Guidelines

## When to Use Each Variant

### Full Logo
- Desktop navigation header
- Login page
- Public-facing pages
- Email templates
- PDF exports

### Icon Only
- Mobile navigation (collapsed sidebar)
- Favicon
- App icons
- Small spaces where full logo doesn't fit

## Size Guidelines

### Small (120px / 32px)
- Compact headers
- Mobile navigation

### Medium (160px / 40px)
- Standard desktop header
- Default size for most uses

### Large (200px / 48px)
- Login page
- Landing page
- Marketing materials

## Theme Variants

### Light Logo
- Use on light backgrounds
- Use in light theme mode
- Default for most cases

### Dark Logo
- Use on dark backgrounds
- Use in dark theme mode
- Ensure proper contrast

## Don'ts

- ❌ Don't stretch or distort the logo
- ❌ Don't change logo colors
- ❌ Don't add effects (shadows, gradients)
- ❌ Don't rotate the logo
- ❌ Don't use low-resolution versions
- ❌ Don't place logo on busy backgrounds

## Dos

- ✅ Maintain aspect ratio
- ✅ Use appropriate variant for context
- ✅ Ensure sufficient padding around logo
- ✅ Use theme-appropriate variant
- ✅ Use SVG when possible for scalability
```

---

## Testing Checklist

### Visual Testing
- [ ] Logo displays correctly in light theme
- [ ] Logo displays correctly in dark theme
- [ ] Logo switches when theme changes
- [ ] Logo is crisp on retina displays
- [ ] Logo scales properly on different screen sizes
- [ ] Icon variant shows on mobile
- [ ] Full logo shows on desktop

### Functional Testing
- [ ] Logo click navigates to home (where applicable)
- [ ] Favicon appears in browser tab
- [ ] Favicon appears in bookmarks
- [ ] Apple touch icon works on iOS
- [ ] Android icons work on Android

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance Testing
- [ ] Logo loads in < 100ms
- [ ] No layout shift when logo loads
- [ ] SVG renders smoothly
- [ ] No console errors

---

## Accessibility

### Alt Text
All logo images must have descriptive alt text:
```typescript
alt="Aurora ATS - Applicant Tracking System"
```

### Contrast
- Ensure logo has sufficient contrast against background
- Light logo: Use on backgrounds darker than #666
- Dark logo: Use on backgrounds lighter than #999

### Focus States
If logo is clickable, ensure visible focus state:
```typescript
sx={{
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    outlineOffset: 2,
  },
}}
```

---

## Acceptance Criteria

- [ ] All logo assets created and optimized
- [ ] Logo component implemented and reusable
- [ ] Logo updated in all specified locations
- [ ] Favicon updated and working
- [ ] Theme switching works correctly
- [ ] Responsive behavior works (full/icon variants)
- [ ] No visual regressions
- [ ] Performance impact < 100ms
- [ ] Accessibility requirements met
- [ ] Documentation complete

---

## Success Metrics

- **Target:** Consistent branding across 100% of interfaces
- **Target:** Logo loads in < 100ms
- **Target:** Zero visual bugs reported
- **Target:** Positive feedback on brand identity

---

## Rollout Plan

### Phase 1: Staging (Day 1)
- Deploy to staging environment
- Internal team review
- Gather feedback

### Phase 2: Production (Day 2)
- Deploy to production
- Monitor for issues
- Quick rollback plan ready

---

## Notes

- Coordinate with design team to get final logo assets
- Consider creating a logo loading skeleton for slow connections
- Future enhancement: Animated logo for loading states
- Future enhancement: Seasonal logo variants (holidays, etc.)

---

## Asset Checklist

Before implementation, ensure you have:

- [ ] `aurora-logo-light.svg`
- [ ] `aurora-logo-dark.svg`
- [ ] `aurora-icon-light.svg`
- [ ] `aurora-icon-dark.svg`
- [ ] `aurora-logo-light.png` (1x, 2x, 3x)
- [ ] `aurora-logo-dark.png` (1x, 2x, 3x)
- [ ] `aurora-icon-light.png` (1x, 2x, 3x)
- [ ] `aurora-icon-dark.png` (1x, 2x, 3x)
- [ ] `favicon.ico`
- [ ] `favicon-16x16.png`
- [ ] `favicon-32x32.png`
- [ ] `apple-touch-icon.png`
- [ ] `android-chrome-192x192.png`
- [ ] `android-chrome-512x512.png`

**Total Files:** 22 assets
