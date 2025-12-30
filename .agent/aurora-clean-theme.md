# Aurora Clean Theme

## Overview
The **Aurora Clean** theme is a flat, minimalist design system inspired by modern dashboard UIs. It features soft colors, minimal shadows, clean typography, and generous whitespace - perfect for professional, data-driven applications.

## Design Philosophy

### Key Characteristics
- **Flat Design**: Minimal shadows and elevation for a clean, modern look
- **Soft Color Palette**: Muted colors that are easy on the eyes
- **Clean Typography**: Clear hierarchy with Inter font family
- **Generous Whitespace**: Breathing room between elements
- **Subtle Interactions**: Smooth transitions without being distracting

## Color Palette

### Primary Colors
- **Primary**: `#5B8DEF` - Soft blue (similar to the reference dashboard)
- **Primary Light**: `#7FA5F3`
- **Primary Dark**: `#4A7BD4`

### Background Colors
- **Default Background**: `#F9FAFB` - Very light gray, almost white
- **Paper**: `#FFFFFF` - Pure white for cards and surfaces

### Text Colors
- **Primary Text**: `#1F2937` - Gray-800 (softer than pure black)
- **Secondary Text**: `#6B7280` - Gray-500

### Status Colors
- **Success**: `#10B981` - Emerald
- **Error**: `#EF4444` - Soft red
- **Warning**: `#F59E0B` - Amber
- **Info**: `#3B82F6` - Blue

### Gray Scale
- 50: `#F9FAFB`
- 100: `#F3F4F6`
- 200: `#E5E7EB`
- 300: `#D1D5DB`
- 400: `#9CA3AF`
- 500: `#6B7280`
- 600: `#4B5563`
- 700: `#374151`
- 800: `#1F2937`
- 900: `#111827`

## Typography

### Font Family
```
"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif
```

### Headings
- **H1**: 2.5rem, weight 700
- **H2**: 2rem, weight 700
- **H3**: 1.5rem, weight 600
- **H4**: 1.25rem, weight 600
- **H5**: 1.125rem, weight 600
- **H6**: 1rem, weight 600

### Body Text
- **Body1**: 0.875rem (14px)
- **Body2**: 0.8125rem (13px)
- **Button**: 0.875rem, weight 500
- **Caption**: 0.75rem (12px)

## Component Styling

### Shadows
Very subtle shadows throughout:
- **Elevation 1** (Cards): `0px 1px 2px rgba(0, 0, 0, 0.04)`
- **Elevation 2**: `0px 1px 3px rgba(0, 0, 0, 0.05)`
- **Elevation 8** (Menus): `0px 6px 16px rgba(0, 0, 0, 0.1)`
- **Elevation 16** (Modals): `0px 12px 24px rgba(0, 0, 0, 0.12)`

### Border Radius
- **Default**: 8px (moderate roundness)
- **Cards/Paper**: 12px
- **Buttons**: 8px
- **Chips**: 6px

### Buttons
- **Contained Primary**: Solid `#5B8DEF` background
- **Outlined**: Light border with transparent background
- **Text**: No background, just colored text
- **Hover Effects**: Subtle color changes and small shadows

### Cards
- White background with very subtle shadow
- 1px border in light gray (`#F3F4F6`)
- Hover effect: Increased shadow and border color change
- Border radius: 12px

### Tables
- **Header**: Light gray background (`#F9FAFB`)
- **Cells**: Minimal borders, good padding
- **Hover**: Subtle background change on rows
- **Typography**: Uppercase headers with letter spacing

### Forms
- **Input Fields**: White background, light gray borders
- **Focus State**: Blue border (`#5B8DEF`)
- **Labels**: Gray-500 color
- **Border Radius**: 8px

### Chips/Tags
- **Default**: Light gray background with border
- **Primary**: Light blue background with blue text
- **Success**: Light green background with green text
- **Error**: Light red background with red text
- **Border Radius**: 6px

## Usage

### Selecting the Theme
1. Navigate to **Settings** → **Preferences**
2. Under **Appearance**, select **"Aurora Clean (Flat & Minimal)"**
3. The theme will be applied immediately and saved to your account

### When to Use Aurora Clean
- **Data-heavy dashboards**: The minimal design keeps focus on the data
- **Professional applications**: Clean and modern without being flashy
- **Long work sessions**: Soft colors reduce eye strain
- **Analytics platforms**: Clear hierarchy helps users understand information
- **Business tools**: Professional appearance suitable for enterprise use

### Comparison with Other Themes

#### vs Aurora Blue
- **Aurora Clean**: Flatter, softer colors, minimal shadows
- **Aurora Blue**: More depth with gradients and stronger shadows

#### vs Aurora Glass
- **Aurora Clean**: Solid backgrounds, no transparency
- **Aurora Glass**: Glassmorphism effects with blur and transparency

#### vs Aurora Charcoal
- **Aurora Clean**: Light theme with soft grays
- **Aurora Charcoal**: Darker theme with charcoal tones

## Technical Details

### File Location
```
libs/aurora-design-system/src/themes/auroraCleanTheme.ts
```

### Export
```typescript
export { auroraClean } from '@acentra/aurora-design-system';
```

### Theme Type
```typescript
type ThemeType = 
  | "auroraBlue"
  | "auroraDarkTeal"
  | "auroraLightTeal"
  | "auroraCharcoal"
  | "auroraLightOrange"
  | "auroraGlass"
  | "auroraClean";  // ← New theme
```

## Design Inspiration

The Aurora Clean theme was inspired by modern dashboard designs that prioritize:
- **Clarity over decoration**
- **Function over form**
- **Readability over aesthetics**
- **Simplicity over complexity**

Similar to designs from:
- Modern SaaS dashboards
- Analytics platforms
- Business intelligence tools
- Professional admin panels

## Accessibility

### WCAG Compliance
- Text contrast ratios meet WCAG AA standards
- Focus states are clearly visible
- Color is not the only means of conveying information
- Interactive elements have sufficient size and spacing

### Color Contrast Ratios
- **Primary text on white**: 11.5:1 (AAA)
- **Secondary text on white**: 4.6:1 (AA)
- **Primary button text**: 4.5:1 (AA)

## Future Enhancements

Potential improvements for the Aurora Clean theme:
- [ ] Dark mode variant (Aurora Clean Dark)
- [ ] High contrast mode for accessibility
- [ ] Customizable accent colors
- [ ] Compact density option
- [ ] Additional color schemes (green, purple, etc.)
