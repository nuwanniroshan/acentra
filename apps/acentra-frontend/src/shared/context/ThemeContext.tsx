import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { Theme } from "@mui/material/styles";
import { auroraTheme, xAuroraDarkTheme, xAuroraLightTheme } from "@acentra/aurora-design-system";
import { usersService } from "@/shared/services/usersService";

type ThemeType = "aurora" | "auroraDark" | "auroraLight";

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  loadUserPreferences: (userId: string) => Promise<void>;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: ThemeType = "aurora";

const themeMap: Record<ThemeType, Theme> = {
  aurora: auroraTheme,
  auroraDark: xAuroraDarkTheme,
  auroraLight: xAuroraLightTheme,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(DEFAULT_THEME);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user preferences from backend
  const loadUserPreferences = useCallback(async (uid: string) => {
    try {
      setUserId(uid);
      const response = await usersService.getUserPreferences(uid);
      const theme = response.preferences?.theme as ThemeType;
      if (theme && themeMap[theme]) {
        setCurrentTheme(theme);
      }
    } catch (error) {
      console.error("Failed to load user preferences:", error);
      // Keep default theme on error
    }
  }, []);

  // Save theme to backend when it changes (only if user is logged in)
  const setTheme = useCallback(async (theme: ThemeType) => {
    setCurrentTheme(theme);
    
    if (userId) {
      try {
        await usersService.updateUserPreferences(userId, { theme });
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  }, [userId]);

  // Reset theme to default (used on logout)
  const resetTheme = useCallback(() => {
    setCurrentTheme(DEFAULT_THEME);
    setUserId(null);
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    theme: themeMap[currentTheme],
    setTheme,
    loadUserPreferences,
    resetTheme,
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