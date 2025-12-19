# Aurora Design System

A comprehensive React component library built on top of Material-UI (MUI), providing a consistent and beautiful design system for building modern web applications.

## Features

- 🎨 **Beautiful Themes**: Pre-configured light and dark themes with glassmorphism effects
- 🧩 **Comprehensive Components**: 30+ wrapped MUI components with Aurora styling
- 🎯 **TypeScript Support**: Full TypeScript definitions for all components
- 📦 **Tree-shakeable**: Import only what you need
- 🔧 **Customizable**: Built on MUI's powerful theming system

## Installation

This library is part of the Acentra monorepo and can be imported using:

```typescript
import { AuroraButton, AuroraCard, auroraTheme } from '@acentra/aurora-design-system';
```

## Usage

### Basic Example

```tsx
import { ThemeProvider } from '@mui/material';
import { auroraTheme, AuroraButton, AuroraCard } from '@acentra/aurora-design-system';

function App() {
  return (
    <ThemeProvider theme={auroraTheme}>
      <AuroraCard>
        <AuroraButton variant="contained">
          Click Me
        </AuroraButton>
      </AuroraCard>
    </ThemeProvider>
  );
}
```

### Available Themes

- `auroraTheme` - Light theme with blue accent (#2563eb)
- `xAuroraTheme` - Dark theme with teal gradient and glassmorphism

## Components

### Layout
- `AuroraBox`, `AuroraContainer`, `AuroraStack`, `AuroraGrid`
- `AuroraPaper`, `AuroraCard`

### Inputs
- `AuroraInput`, `AuroraSelect`, `AuroraCheckbox`, `AuroraRadio`
- `AuroraSwitch`, `AuroraSlider`

### Navigation
- `AuroraAppBar`, `AuroraToolbar`, `AuroraMenu`
- `AuroraTabs`, `AuroraBreadcrumbs`, `AuroraPagination`

### Data Display
- `AuroraTable`, `AuroraList`, `AuroraAvatar`
- `AuroraBadge`, `AuroraChip`, `AuroraTooltip`

### Feedback
- `AuroraAlert`, `AuroraDialog`, `AuroraSnackbar`
- `AuroraProgress`, `AuroraSkeleton`

### And More
- `AuroraButton`, `AuroraTypography`, `AuroraDivider`
- `AuroraDrawer`, `AuroraAccordion`, `AuroraTimeline`

## Peer Dependencies

This library requires the following peer dependencies:

- `react` ^19.0.0
- `react-dom` ^19.0.0
- `@mui/material` ^7.3.5
- `@mui/lab` ^7.0.1-beta.19
- `@mui/icons-material` ^7.3.5
- `@emotion/react` ^11.14.0
- `@emotion/styled` ^11.14.1

## Development

This library is built using Nx and follows Nx best practices for library development.

### Building

```bash
nx build aurora-design-system
```

### Linting

```bash
nx lint aurora-design-system
```

## License

MIT