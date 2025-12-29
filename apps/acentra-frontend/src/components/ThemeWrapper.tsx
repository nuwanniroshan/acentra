import type { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import type { Theme } from "@mui/material";
import { auroraBlue } from "@acentra/aurora-design-system";

interface ThemeWrapperProps {
  children: ReactNode;
  theme?: Theme;
}

export function ThemeWrapper({ children, theme = auroraBlue }: ThemeWrapperProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
