import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Theme } from "@mui/material/styles";
import { auroraTheme, xAuroraDarkTheme, xAuroraLightTheme } from "@acentra/aurora-design-system";

type ThemeType = "aurora" | "auroraDark" | "auroraLight";

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "acentra-theme";

const themeMap: Record<ThemeType, Theme> = {
  aurora: auroraTheme,
  auroraDark: xAuroraDarkTheme,
  auroraLight: xAuroraLightTheme,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as ThemeType) || "aurora";
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  const value: ThemeContextType = {
    currentTheme,
    theme: themeMap[currentTheme],
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}